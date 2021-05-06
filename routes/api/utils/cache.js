const NodeCache = require("node-cache");

class LFUCache {
  constructor(maxBytes, cacheOptions = {}, logger = (request, params) => {}) {
    this.cacheOptions = cacheOptions
    this.cache = new NodeCache(cacheOptions);
    this.frequencyMap = {}
    this.maxBytes = maxBytes
    this.logger = logger
  }

  del(key) {
    this.logger("DEL", { key })

    delete this.frequencyMap[key]
    return this.cache.del(key)
  }

  canHoldValue(key, value) {
    const testCache = new NodeCache(this.cacheOptions)
    let returnVal = false

    try {
      testCache.set(key, value)
      const stats = testCache.getStats()
      
      if ((stats.vsize + stats.ksize) <= this.maxBytes) { 
        returnVal = true
      }
    } catch(e) {}

    testCache.flushAll()
    return returnVal
  }

  set(key, value) {
    this.logger("SET", { key, value })

    if (this.canHoldValue(key, value)) {
      this.frequencyMap[key] = 0
      const result = this.cache.set(key, value)
      let stats = this.cache.getStats()
  
      if ((stats.vsize + stats.ksize) > this.maxBytes) {
        let keys = Object.keys(this.frequencyMap).sort((a, b) => {
          if (a == key) return 1
          else if (b == key) return -1
          else return this.frequencyMap[a] - this.frequencyMap[b]
        })
  
        for (const toDelete of keys) {
          this.del(toDelete)
          stats = this.cache.getStats()
  
          if ((stats.vsize + stats.ksize) <= this.maxBytes) break;
        }
      }
  
      return result
    } else {
      throw new Error("Cannot set key value pair for provided data")
    }
  }

  get(key) {
    this.logger("GET", { key })

    const value = this.cache.get(key)

    if (value != null && this.frequencyMap[key] != null) {
      this.frequencyMap[key] = this.frequencyMap[key] + 1
    } else this.frequencyMap[key] = 1
    
    return this.cache.get(key)
  }

  has(key) {
    this.logger("HAS", { key })

    return this.cache.has(key)
  }

  keys() {
    this.logger("KEYS")

    return this.cache.keys()
  }

  getStats() {
    return this.cache.getStats()
  }
}

module.exports = LFUCache