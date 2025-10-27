import { observer } from "mobx-react-lite";
import dptLogo from '../assets/logo-dptechnics.svg';

export const Footer = observer(() => (
  <section className="footer">
    <p>Welcome at booth 6047</p>
    <img src={dptLogo} alt="DPTechnics logo" />
  </section>
));