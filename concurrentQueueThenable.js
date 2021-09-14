'use strict';

class Thenable {
  constructor(executor) {
    if (executor) {
      executor(data => {
        this.resolve(data);
      }, err => {
        this.reject(err);
      });
    }
    this.next = null;
  }
  then(onFulfillment, onRejection) {
    this.onFulfillment = onFulfillment;
    this.onRejection = onRejection;
    const next = new Thenable();
    this.next = next;
    return next;
  }
  resolve(data) {
    if (this.onFulfillment) {
      const next = this.onFulfillment(data);
      if (next) {
        if (next.then) {
          next.then(data => {
            this.next.resolve(data);
          }, err => {
            this.next.reject(err);
          });
        } else {
          this.next.resolve(next);
        }
      }
    }
  }
  reject(err) {
    if (this.onRejection) {
      this.onRejection(err);
    } else {
      throw new Error('unhandled error in Thenable');
    }
  }
}

class ConcurrentQueue {
  constructor(concurrency) {
    this.concurrency = concurrency || 1;
    this.count = 0;
    this.destination = null;
    // this.onDone = null;
    this.onFailure = null;
    this.onProcess = null;
    this.onSuccess = null;
    // this.onDrain = null;
    this.paused = false;
    this.waiting = [];
    this.waitTimeout = Infinity;
    this.priorityMode = false;
    this.processTimeout = Infinity;
  }
  add(task, priority = 0) {
    const thenable = new Thenable();
    const hasChannel = this.count < this.concurrency;
    if (hasChannel && !this.paused) {
      this.next({ task, thenable });
    } else {
      this.waiting.push({ task, start: Date.now(), priority, thenable });
      if (this.priorityMode === true) {
        this.waiting.sort((a, b) => b.priority - a.priority);
      }
    }
    return thenable;
  }
  static channel(concurrency) {

    this.concurrency = concurrency;
    return this;
  }
  done(listener) {
    this.onDone = listener;
    return this;
  }
  finish(err, data) {
    const { onSuccess, onFailure } = this;
    if (err) {
      if (onFailure) {
        onFailure(err, data);
      }
    } else if (onSuccess) {
      if (this.destination) {
        const { result, thenable } = data;
        this.destination.add({ result })
          .then(result => {
            onSuccess({ result, thenable });
          }, result => {
            if (onFailure) {
              const err = new Error('Error from destination');
              onFailure(err, { result, thenable });
            }
          });
      } else {
        onSuccess(data);
      }
    }
    // if (onDone) {
    //   onDone(err, data);
    // }
  }
  failure(listener) {
    this.onFailure = listener;
    return this;
  }
  next(element) {
    this.count++;
    let timer = null;
    let finished = false;
    const { processTimeout, onProcess } = this;
    const finish = (err, data) => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      this.count--;
      this.finish(err, data);
      if (!this.paused && this.waiting.length > 0) this.waitingNext();
    };
    if (processTimeout !== Infinity) {
      timer = setTimeout(() => {
        timer = null;
        const err = new Error('Process timeout');
        finish(err, element);
      }, processTimeout);
    }
    onProcess(element, finish);
  }
  pause() {
    this.paused = true;
    return this;
  }
  pipe(destination) {
    this.destination = destination;
    return this;
  }
  priority(priority = true) {
    this.priorityMode = priority;
    return this;
  }
  resume() {
    if (this.waiting.length > 0) {
      const channels = this.concurrency - this.count;
      for (let i = 0; i < channels; i++) {
        this.waitingNext();
      }
    }
    this.paused = false;
    return this;
  }
  process(listener) {
    this.onProcess = listener;
    return this;
  }
  success(listener) {
    this.onSuccess = listener;
    return this;
  }
  timeout(msec) {
    this.processTimeout = msec;
    return this;
  }
  wait(msec) {
    this.waitTimeout = msec;
    return this;
  }
  waitingNext() {
    const { waiting, waitTimeout } = this;
    const element = waiting.shift();
    const { start } = element;
    if (this.waitTimeout !== Infinity) {
      const difference = Date.now() - start;
      if (difference > waitTimeout) {
        const err = new Error('Waiting timed out');
        this.finish(err, element);
        if (waiting.length > 0) {
          setTimeout(() => {
            if (!this.paused && waiting.length > 0) this.waitingNext();
          });
        }
        return;
      }
    }
    const hasChannel = this.count < this.concurrency;
    if (hasChannel) this.next(element);
    return;
  }
}

module.exports = ConcurrentQueue;
