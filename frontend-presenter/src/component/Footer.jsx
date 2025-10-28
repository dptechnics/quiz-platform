import { observer } from "mobx-react-lite";
import dptLogo from '../assets/logo-dptechnics.svg';
import quickspotLogo from '../assets/logo-quickspot.svg';
import bluecherryLogo from '../assets/logo-bluecherry.svg';

export const Footer = observer(() => (
  <section className="footer">
    <p>Discover multi-radio IoT (LTE-M, NB-IoT, WiFi, BLE, GNSS) in a single module at booth 6047</p>
    <div className="footerImages">
      <img src={quickspotLogo} alt="Quickspot logo" />
      <img src={dptLogo} alt="DPTechnics logo" />
      <img src={bluecherryLogo} alt="BlueCherry logo" />
    </div>
    
  </section>
));