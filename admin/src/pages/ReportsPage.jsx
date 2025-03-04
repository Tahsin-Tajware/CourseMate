import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axiosPrivate from "../api/axiosPrivate";

const API_BASE_URL = "http://127.0.0.1:8000/api/admin";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axiosPrivate.get(`${API_BASE_URL}/reports`);
      setReports(response.data);
      console.log("Reports fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const resolveReport = async (reportId) => {
    try {
      await axiosPrivate.put(`${API_BASE_URL}/reports/resolve/${reportId}`);
      fetchReports();
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  const markReportReviewed = async (reportId) => {
    try {
      await axiosPrivate.put(`${API_BASE_URL}/reports/review/${reportId}`);
      fetchReports();
    } catch (error) {
      console.error("Error marking report as reviewed:", error);
    }
  };

  return (
    <Box sx={{ p: 4, background: '#f4f6f9', minHeight: '100vh', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#333', textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
        User Reports
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {reports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)', p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.2rem', mb: 1 }}>
                {report.reason}
                </Typography>
                <Typography variant="body2" sx={{ color: '#777', mb: 2 }}>
                Reported comment: {report.comment ? report.comment.content : 'No comment'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold', mb: 1 }}>
                  Reported by: {report.user ? report.user.name : 'Unknown'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#2e7d32', color: 'white', '&:hover': { backgroundColor: '#1b5e20' }, flex: 1 }}
                    startIcon={<CheckCircleIcon />}
                    onClick={() => resolveReport(report.id)}
                  >
                    Resolve
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#d32f2f', color: 'white', '&:hover': { backgroundColor: '#b71c1c' }, flex: 1 }}
                    startIcon={<VisibilityIcon />}
                    onClick={() => markReportReviewed(report.id)}
                  >
                    Mark as Reviewed
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReportsPage;
