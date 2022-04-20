import { Alert, Button } from "@mantine/core";
import { usePwa } from "../lib/pwaInstall";

interface HomeProps {
  username?: string;
}

export const Home = ({ username }: HomeProps) => {
  const { isSupported, isInstalled, install } = usePwa();

  return (
    <>
      {username && <h1>Szia {username}</h1>}
      {
        /*isSupported() && !isInstalled*/ true && (
          <Alert title="Nem vagy netközelben?">
            <p>
              Telepítsd az alkalmazást, és használd bárhol bármikor internet
              nélkül is.
            </p>
            <Button onClick={install}>Telepít</Button>
          </Alert>
        )
      }
    </>
  );
};
