import { Button, Center, Grid, Group, Navbar } from "@mantine/core";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Home2, List, Plus, ReportAnalytics, Logout } from "tabler-icons-react";
import { auth } from "../lib/firebase";

export const MobileNavbar = () => {
  let navigate = useNavigate();

  const homeClick = () => navigate("/");
  const listClick = () => navigate("/list");
  const plusClick = () => navigate("/new");
  const analyticsClick = () => navigate("/log");
  const signOutClick = () => signOut(auth);

  return (
    <Navbar
      position={{ bottom: 0 }}
      fixed
      height={40}
      style={{
        boxShadow: "0 16px 32px rgb(0 0 0 / 50%)",
        height: "60px",
        paddingTop: "10px",
        zIndex: 10,
      }}
    >
      <Group position="center" noWrap spacing="sm">
        <Button variant="outline" onClick={homeClick}>
          <Home2 />
        </Button>
        <Button variant="outline" onClick={listClick}>
          <List />
        </Button>
        <Button radius="xl" onClick={plusClick}>
          <Plus />
        </Button>
        <Button variant="outline" onClick={analyticsClick}>
          <ReportAnalytics />
        </Button>
        <Button variant="outline">
          <Logout onClick={signOutClick} />
        </Button>
      </Group>
    </Navbar>
  );
};

// <Grid columns={5}>
// <Grid.Col span={1}>
//   <Navbar.Section>
//     <Center>Otthon</Center>
//   </Navbar.Section>
// </Grid.Col>
// <Grid.Col span={1}>
//   <Navbar.Section>
//     <Center>Lista</Center>
//   </Navbar.Section>
// </Grid.Col>
// <Grid.Col span={1}>
//   <Navbar.Section>
//     <Center>
//       <Button radius="xl">+</Button>
//     </Center>
//   </Navbar.Section>
// </Grid.Col>
// <Grid.Col span={1}>
//   <Navbar.Section>
//     <Center>Naplo</Center>
//   </Navbar.Section>
// </Grid.Col>
// <Grid.Col span={1}>
//   <Navbar.Section>
//     <Center>Misc</Center>
//   </Navbar.Section>
// </Grid.Col>
// </Grid>
