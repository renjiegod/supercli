/** 场景页增强：正文在构建时输出，客户端只负责语言切换。路由：/guides/*、/en/guides/*。 */
import { setupLanguage } from "./i18n";
import "./style.css";
import "./styles/guides.css";
setupLanguage();
