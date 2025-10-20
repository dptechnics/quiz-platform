import { observer } from "mobx-react-lite";
import dptLogo from '../assets/logo-dptechnics.svg';

export const Footer = observer(() => (
  <section className="footer">
    <img src={dptLogo} alt="DPTechnics logo" />
  </section>
));