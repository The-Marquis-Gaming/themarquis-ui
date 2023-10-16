import Header from "./components/Header/Header";
import ContainerIndex from "./components/ContainerIndex/ContainerIndex";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function Home() {
  return (
    <main className="">
      <Header pageTitle="The Marquis" />
      <ContainerIndex></ContainerIndex>
    </main>
  );
}
