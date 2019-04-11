const types = require('@lokomotes/station-types')
const MsgType = types.MsgType

// description of ponger.
const ponger = {
  name: 'ponger',
  image: 'ponger:latest'
}

/**
 * @param {types.Station} station
 * @param {Array<string>} args
 */
module.exports = (station, args) => {
  // this variable is sustained during workflow runtime.
  let cnt = 3

  if (args.length > 0) {
    var parsed = parseInt(x)
    if (!isNaN(parsed)) cnt = parsed
  }

  let ping = () => {
    setTimeout(() => {
      station.log('ping')
      // send signal to `ponger` with message "pinged".
      station.send(MsgType.Signal, 'pinged').to(ponger)
    }, 1000)
  }

  // listen signal from `ponger`.
  /**
   * @param {string} msg
   * @param {types.StationDesc} src
   */
  station.grab(ponger).on(MsgType.Signal, (msg, src) => {
    station.log(`${msg} from ${src.name}`)
    if (--cnt === 0) {
      // tell ponger to stop playing.
      station.send(MsgType.Block).to(ponger)
      // stop this activity.
      station.close()
      return
    }
    ping()
  })
  // Preparing the ponger station.
  station.send(MsgType.Link).to(ponger)

  cnt > 0 ? ping() : station.close()
}