import './style.scss';
import './audiocall/styles/audiocallStyle.scss';
import { Audiocall } from './audiocall/components/Audiocall';

const audiocall = new Audiocall();
audiocall.mount(document.body);
