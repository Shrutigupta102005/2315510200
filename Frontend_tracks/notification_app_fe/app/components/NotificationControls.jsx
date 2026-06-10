"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { notificationTypes } from "@/lib/notifications";

export function NotificationControls({
  type,
  onTypeChange,
  limit,
  onLimitChange,
  page,
  onPageChange,
  showPage = true,
  minLimit = 5,
}) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="type-filter-label">Type</InputLabel>
        <Select
          labelId="type-filter-label"
          value={type}
          label="Type"
          onChange={(event) => onTypeChange(event.target.value)}
        >
          {notificationTypes.map((item) => (
            <MenuItem key={item} value={item}>
              {item === "all" ? "All types" : item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Limit"
        type="number"
        value={limit}
        onChange={(event) => onLimitChange(event.target.value)}
        inputProps={{ min: minLimit, max: 50 }}
        sx={{ width: { xs: "100%", sm: 120 } }}
      />

      {showPage && (
        <TextField
          size="small"
          label="Page"
          type="number"
          value={page}
          onChange={(event) => onPageChange(event.target.value)}
          inputProps={{ min: 1 }}
          sx={{ width: { xs: "100%", sm: 120 } }}
        />
      )}
    </Stack>
  );
}
