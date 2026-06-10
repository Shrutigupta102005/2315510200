"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import InboxIcon from "@mui/icons-material/Inbox";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

export function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar sx={{ gap: 2, flexWrap: "wrap", py: 1 }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexGrow: 1, minWidth: 220 }}>
            <NotificationsIcon color="primary" />
            <Typography variant="h6" color="text.primary">
              Campus Notifications
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              href="/"
              variant={pathname === "/" ? "contained" : "outlined"}
              startIcon={<InboxIcon />}
            >
              All
            </Button>
            <Button
              component={Link}
              href="/priority"
              variant={pathname === "/priority" ? "contained" : "outlined"}
              startIcon={<PriorityHighIcon />}
            >
              Priority
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}
