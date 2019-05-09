module.exports = class qTools {
    constructor(args) {
        if (args) {
            this.catcher = args.catch || false;
            this.start = args.start;
        }
        this.prequeue = [];
        this.promise = Promise.resolve();
        if (this.start) this.fire();
        else this.pause();
        return this;
    }

    force(func) { this.queue(func, "finally") }

    add(func) { this.queue(func, "then") }

    all(arr) { this.queue(arr, "all") }

    race(arr) { this.queue(arr, "race") }

    catch(func) { if (func) this.catcher = func; this.queue(this.catcher, "catch") }

    pause() { this.start = false }

    fire() {
        this.start = true;
        this.prequeue.forEach(el => this.queue(...el));
        if (this.catcher) this.catch();
        this.prequeue = [];
    }

    queue(func, then) {
        if (typeof func === "object" && Array.isArray(func)) func.forEach(el => this.queue(el, then));
        if (typeof func === "function") {
            if (!this.start) {
                this.prequeue.push([func, then]);
                return;
            }
            this.promise = this.promise[then](func);
        }
    }
}