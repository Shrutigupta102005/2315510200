"use client";

import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { getTypeColor } from "@/lib/notifications";

export function NotificationList({
  notifications,
  viewedIds,
  onToggleViewed,
  loading,
  error,
  emptyText,
  showScore = false,
}) {
  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (notifications.length === 0) {
    return <Alert severity="info">{emptyText}</Alert>;
  }

  return (
    <Stack spacing={1.5}>
      {notifications.map((notification) => {
        const viewed = viewedIds.has(notification.id);

        return (
          <Card key={notification.id}>
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                    <Chip
                      size="small"
                      label={notification.type}
                      color={getTypeColor(notification.type)}
                    />
                    <Chip
                      size="small"
                      label={viewed ? "Viewed" : "New"}
                      color={viewed ? "default" : "secondary"}
                      variant={viewed ? "outlined" : "filled"}
                    />
                    {showScore && (
                      <Chip size="small" label={`Score ${notification.score.toFixed(2)}`} variant="outlined" />
                    )}
                  </Stack>

                  <Typography variant="h6" sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, mb: 0.5 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.timestamp}
                  </Typography>
                </Box>

                <Button
                  variant={viewed ? "outlined" : "contained"}
                  color={viewed ? "inherit" : "primary"}
                  startIcon={viewed ? <MarkunreadIcon /> : <MarkEmailReadIcon />}
                  onClick={() => onToggleViewed(notification.id)}
                  sx={{ alignSelf: { xs: "stretch", md: "center" }, minWidth: 150 }}
                >
                  {viewed ? "Mark new" : "Mark viewed"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
