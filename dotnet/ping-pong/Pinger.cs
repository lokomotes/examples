using System;
using System.Threading.Tasks;
using Loko.Station;

namespace PingPong
{
    public class Pinger : IApp
    {
        public static StationDesc ponger = new StationDesc
        {
            Name = "ponger",
            Image = "ponger:latest"
        };

        public void Open(IStation station, string[] args)
        {
            this.station = station;
            if (args.Length > 0 && Int32.TryParse(args[0], out var c))
            {
                this.cnt = c;
            }

            station.Grab(ponger).Signaled += handlePong;

            station.Send(MsgType.Link, "").To(ponger);

            if (this.cnt > 0) ping();
            else station.Close();
        }

        private IStation station;
        private int cnt = 3;

        private async void ping()
        {
            await Task.Delay(1000);
            station.Log("ping");
            await station.Send(MsgType.Signal, "pinged").To(ponger);
        }

        private async void handlePong(string msg, StationDesc src)
        {
            Console.WriteLine($"{msg} from {src.Name}");
            if (--cnt == 0)
            {
                await station.Send(MsgType.Block, "").To(ponger);
                station.Close();
                return;
            }
            ping();
        }
    }
}
