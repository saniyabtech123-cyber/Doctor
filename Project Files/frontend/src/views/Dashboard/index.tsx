// React Imports
import { useNavigate } from "react-router-dom";
// Utils
import {
  convertToAMPMFormat,
  maskingPhoneNumber,
  thousandSeparatorNumber,
} from "../../utils";
// React Icons
import { IoPhonePortraitOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { CiMoneyCheck1 } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
// MUI Imports
import { Box, Grid, Divider, Typography } from "@mui/material";
// Custom Imports
import { Heading } from "../../components/Heading";
import Navbar from "../../components/Navbar";
import { useGetApprovedDoctorsQuery } from "../../redux/api/doctorSlice";
import OverlayLoader from "../../components/Spinner/OverlayLoader";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetApprovedDoctorsQuery({});

  return (
    <>
      {isLoading && <OverlayLoader />}
      <Navbar>
        <Heading sx={{ fontSize: 28, fontWeight: 600, mb: 1 }}>Available Doctors</Heading>
        {data?.data?.length !== 0 && (
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#4b5563", mb: 2 }}>
            Select Doctor to add Appointments
          </Typography>
        )}

        <Box sx={{ background: "linear-gradient(to bottom right, #f7fbff, #eef3f8)", px: 2, py: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            {data?.data?.length === 0 ? (
              <Box
                sx={{
                  background: "#ffffffcc",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  width: "100%",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  backdropFilter: "blur(4px)",
                }}
              >
                No Doctors Available in this Clinic
              </Box>
            ) : (
              data?.data?.map((row: any) => (
                <Grid item xs={12} sm={6} md={4} key={row?.userId}>
                  <Box
                    sx={{
                      background: "#ffffff",
                      borderRadius: "12px",
                      padding: "20px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                      '&:hover': {
                        transform: "scale(1.02)",
                        border: "2px solid #14b8a6",
                      },
                    }}
                    onClick={() => navigate(`/book-appointments/${row?.userId}`)}
                  >
                    <Heading
                      sx={{
                        fontSize: 20,
                        fontWeight: 600,
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {`${row?.prefix} ${row?.fullName}`}
                      <Box sx={{ fontSize: 14, fontWeight: 400, color: "#6b7280" }}>
                        {`(${row?.specialization})`}
                      </Box>
                    </Heading>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box sx={{ minWidth: 140, display: "flex", alignItems: "center", gap: 1 }}>
                        <IoPhonePortraitOutline /> Phone Number
                      </Box>
                      <Box>{maskingPhoneNumber(row?.phoneNumber)}</Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box sx={{ minWidth: 140, display: "flex", alignItems: "center", gap: 1 }}>
                        <CiLocationOn /> Address
                      </Box>
                      <Box>{row?.address}</Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box sx={{ minWidth: 140, display: "flex", alignItems: "center", gap: 1 }}>
                        <CiMoneyCheck1 /> Fee Per Visit
                      </Box>
                      <Box>{thousandSeparatorNumber(row?.feePerConsultation)}</Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ minWidth: 140, display: "flex", alignItems: "center", gap: 1 }}>
                        <IoMdTime /> Timings
                      </Box>
                      <Box>{`${convertToAMPMFormat(row?.fromTime)} to ${convertToAMPMFormat(row?.toTime)}`}</Box>
                    </Box>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Navbar>
    </>
  );
};

export default Dashboard;
