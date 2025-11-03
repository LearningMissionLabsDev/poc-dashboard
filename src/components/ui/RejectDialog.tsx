import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

interface RejectDialogProps {
  open: boolean;
  reason: string;
  onChangeReason: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function RejectDialog({
  open,
  reason,
  onChangeReason,
  onClose,
  onSubmit,
}: RejectDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reject Application</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, color: "#374151" }}>
          Please describe which documents are incorrect or need rework before resubmission.
        </Typography>
        <TextField
          multiline
          minRows={4}
          fullWidth
          value={reason}
          onChange={(e) => onChangeReason(e.target.value)}
          placeholder="e.g. Name mismatch in property deed; income verification incomplete..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          disabled={!reason.trim()}
          onClick={onSubmit}
        >
          Submit Rejection
        </Button>
      </DialogActions>
    </Dialog>
  );
}