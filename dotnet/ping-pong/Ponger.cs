using System;
using System.Threading.Tasks;
using Loko.Station;

namespace PingPong
{
    public class Ponger : Loko.Station.Template.Accept
    {
        private StationDesc pinger;

        public Ponger() : base(1) { }

        public override void Start(string message, StationDesc src)
        {
            pinger = src;

            var grabPinger = Station.Grab(pinger);
            grabPinger.Signaled += handlePing;
            grabPinger.Blocked += handleBlock;
        }

        private async void pong()
        {
            await Task.Delay(1000);
            Station.Log("pong");
            await Station.Send(MsgType.Signal, "ponged").To(pinger);
        }

        private void handlePing(string msg, StationDesc src)
        {
            Station.Log($"{msg} from {src.Name}");
            pong();
        }

        private void handleBlock(string msg, StationDesc src)
        {
            Station.Close();
        }
    }
}