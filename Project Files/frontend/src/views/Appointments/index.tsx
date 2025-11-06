import { Heading } from "../../components/Heading";
import MUITable, {
  StyledTableCell,
  StyledTableRow,
} from "../../components/MUITable";
import Navbar from "../../components/Navbar";
import OverlayLoader from "../../components/Spinner/OverlayLoader";
import useTypedSelector from "../../hooks/useTypedSelector";
import { formatDate, formatTime, maskingPhoneNumber } from "../../utils";
import { useUserAppointmentsQuery } from "../../redux/api/userSlice";
import { selectedUserId } from "../../redux/auth/authSlice";
import { Box, Typography } from "@mui/material";
import CustomChip from "../../components/CustomChip";
import { IoBookOutline } from "react-icons/io5";

const tableHead = ["Id", "Doctor", "Phone", "Date", "Status"];

const Appointments = () => {
  const userId = useTypedSelector(selectedUserId);
  const { data, isLoading, isSuccess } = useUserAppointmentsQuery({ userId });

  return (
    <>
      {isLoading && <OverlayLoader />}

      <Navbar>
        <Heading sx={{ fontSize: 28, fontWeight: 600, mb: 1 }}>Appointments</Heading>

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            background: "#ffffffcc",
            backdropFilter: "blur(6px)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
          }}
        >
          <MUITable tableHead={tableHead}>
            {isSuccess && data.data.length > 0 ? (
              data.data.map((row: any) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell>{row._id}</StyledTableCell>
                  <StyledTableCell>
                    {`${row.doctorInfo?.prefix} ${row.doctorInfo?.fullName}`}
                  </StyledTableCell>
                  <StyledTableCell>
                    {maskingPhoneNumber(row?.doctorInfo?.phoneNumber)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {`${formatDate(row?.date)} ${formatTime(row?.time)}`}
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomChip
                      label={
                        row.status === "pending"
                          ? "Pending"
                          : row.status === "approved"
                          ? "Approved"
                          : row.status === "rejected"
                          ? "Cancelled"
                          : ""
                      }
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={tableHead.length} align="center" sx={{ height: 120 }}>
                  <Box
                    sx={{
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      color: "#6b7280",
                    }}
                  >
                    <IoBookOutline />
                    {data?.data?.length === 0 ? "No records found" : ""}
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </MUITable>
        </Box>
      </Navbar>
    </>
  );
};

export default Appointments;
