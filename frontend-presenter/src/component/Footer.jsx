import { observer } from "mobx-react-lite";
import dptLogo from '../assets/logo-dptechnics.svg';
import quickspotLogo from '../assets/logo-quickspot.svg';
import bluecherryLogo from '../assets/logo-bluecherry.svg';

export const Footer = observer(() => (
  <section className="footer">
    <p>Discover the Walter family (LTE-M/NB-IoT or Cat 1 bis + WiFi, BLE, GNSS) in hall 3 booth 510</p>
    <div className="footerImages">
      <img src={quickspotLogo} alt="Quickspot logo" />
      <img src={dptLogo} alt="DPTechnics logo" />
      <img src={bluecherryLogo} alt="BlueCherry logo" />
    </div>
    
  </section>
));