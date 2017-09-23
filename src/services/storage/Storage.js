import React from 'react';
import { AsyncStorage } from 'react-native'

class Storage {
    data = ''
    storageName = ''

    async persist(previousData) {
      let dataToPersist = new Array()
      if (previousData != undefined) {
        dataToPersist = previousData
      }
      if (this.data.id == undefined) {
        this.data.id = this.generateID();
      }
      dataToPersist.push(this.data)
      let result = false
      try {
        await AsyncStorage.setItem(this.storageName, JSON.stringify(dataToPersist))
        return true;
      } catch (error) {
        console.log(error)
      }
      return result
    }

    async update () {
      let changed = false
      let dataToPersist = await this.loadAll()
      for (var i = 0; i < dataToPersist.length; i++) {
        let data = dataToPersist[i]
        if (data.id == this.data.id) {
          dataToPersist[i] = this.data
          changed = true
          break;
        }
      }
      if (!changed) {
        return false;
      }
      try {
        await AsyncStorage.setItem(this.storageName, JSON.stringify(dataToPersist))
        return true;
      } catch (error) {
        console.log(error)
      }
      return false
    }

    async append() {
      let dataToPersist = await this.loadAll()
      for (var i = 0; i < dataToPersist.length; i++) {
        let data = dataToPersist[i]
        if (data.id == undefined) {
          data.id = this.generateID;
          dataToPersist[i] = data;
        }
      }
      return await this.persist(dataToPersist)
    }

    async loadAll() {
      let modelString = await AsyncStorage.getItem(this.storageName)
      return (!modelString) ? [] : JSON.parse(modelString);
    }

    generateID () {
      var d = new Date().getTime();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
          d += performance.now(); //use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }

}

module.exports = Storage;
