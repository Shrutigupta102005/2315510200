"use client";

import RefreshIcon from "@mui/icons-material/Refresh";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { AppShell } from "@/app/components/AppShell";
import { NotificationControls } from "@/app/components/NotificationControls";
import { NotificationList } from "@/app/components/NotificationList";
import { useNotifications } from "@/app/hooks/useNotifications";
import { useViewedNotifications } from "@/app/hooks/useViewedNotifications";
import { useState } from "react";

export default function PriorityNotificationsPage() {
  const [type, setType] = useState("all");
  const [limit, setLimit] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const { viewedIds, toggleViewed } = useViewedNotifications();
  const { notifications, source, warning, loading, error } = useNotifications({
    type,
    limit,
    page: 1,
    priority: true,
    refreshKey,
  });

  return (
    <AppShell>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Priority Notifications
          </Typography>
          <Typography color="text.secondary">
            Top ranked updates using notification weight and recency.
          </Typography>
        </Box>

        <Paper sx={{ p: { xs: 2, md: 3 }, border: "1px solid", borderColor: "divider" }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
            <NotificationControls
              type={type}
              onTypeChange={setType}
              limit={limit}
              onLimitChange={(value) => setLimit(clampNumber(value, 1, 20))}
              page={1}
              onPageChange={() => {}}
              showPage={false}
              minLimit={1}
            />

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((value) => value + 1)}
              sx={{ alignSelf: { xs: "stretch", md: "flex-start" } }}
            >
              Refresh
            </Button>
          </Stack>

          {source === "sample" && warning && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Live API unavailable, showing sample notifications.
            </Alert>
          )}

          <NotificationList
            notifications={notifications}
            viewedIds={viewedIds}
            onToggleViewed={toggleViewed}
            loading={loading}
            error={error}
            emptyText="No priority notifications match the selected filters."
            showScore
          />
        </Paper>
      </Stack>
    </AppShell>
  );
}

function clampNumber(value, min, max) {
  const parsed = Number.parseInt(value || min, 10);
  return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : min));
}
