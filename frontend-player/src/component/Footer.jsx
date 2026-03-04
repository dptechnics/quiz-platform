import { observer } from "mobx-react-lite";
import dptLogo from '../assets/logo-dptechnics.svg';

export const Footer = observer(() => (
  <section className="footer">
    <p>Visit us in hall 3 booth 510</p>
    <img src={dptLogo} alt="DPTechnics logo" />
  </section>
));