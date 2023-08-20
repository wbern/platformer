import { clientValidatedEnv } from "../config/client-env";
import styles from "./page.module.css";

export default async function Home() {
  const { searchResult } = await getProps();

  return (
    <main className={styles.main}>
      <div>
        <h2>Client-side env</h2>
        <div className={styles.description}>
          {Object.keys(clientValidatedEnv).map((key) => (
            <div key={key}>
              {key}:{" "}
              {clientValidatedEnv[key as keyof typeof clientValidatedEnv]}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Server data</h2>
        <div className={styles.description}>{searchResult}</div>
      </div>
    </main>
  );
}

export const getProps = async () => {
  const { MY_SECRET_KEY } = (await import("../config/server-env"))
    .serverValidatedEnv;

  const result = await (
    await fetch(`https://www.google.com/search?q=${MY_SECRET_KEY}`)
  ).text();

  return {
    searchResult: result.substring(0, 50) + "...",
  };
};
