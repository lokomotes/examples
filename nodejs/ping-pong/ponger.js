const types = require('@lokomotes/station-types')
const MsgType = types.MsgType

// allow only one station to link.
/**
 * @param {types.Station} station
 * @param {Array<string>} args
 */
module.exports = types.template.accept(1, async (station, msg, src) => {
  let pong = (dst) => {
    station.log('pong')
    setTimeout(() => {
      // send signal to `dst` with message "ponged".
      station.send(MsgType.Signal, 'ponged').to(dst)
    }, 1000)
  }

  // listen signal from linked station.
  station.grab(src).on(MsgType.Signal, (msg) => {
    station.log(`${msg} from ${src.name}`)
    pong(src)
  })

  // listen block message from linked station.
  station.grab(src).on(MsgType.Block, () => {
    // the `ponger` can not send messages to the linked Station anymore,
    // so there is nothing to do.

    // stop this activity.
    station.close()
  })
})