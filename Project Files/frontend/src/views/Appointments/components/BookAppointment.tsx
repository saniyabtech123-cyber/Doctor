// React Imports
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Redux
import {
  useBookedAppointmentsQuery,
  useCheckBookingAvailabilityMutation,
  useGetDoctorQuery,
} from "../../../redux/api/doctorSlice";
// Utils
import {
  add30Minutes,
  convertToAMPMFormat,
  formatDate,
  formatTime,
  onKeyDown,
  thousandSeparatorNumber,
} from "../../../utils";
// React Icons
import { RiLuggageDepositLine } from "react-icons/ri";
import { MdOutlineExplicit } from "react-icons/md";
import { CiLocationOn, CiMoneyCheck1 } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
// Formik
import { Form, Formik, FormikProps } from "formik";
// Yup
import * as Yup from "yup";
// MUI Imports
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Grid, Divider, Button, TextField, Paper } from "@mui/material";
// Custom Imports
import DatePicker from "../../../components/DatePicker";
import Navbar from "../../../components/Navbar";
import { Heading, SubHeading } from "../../../components/Heading";
import OverlayLoader from "../../../components/Spinner/OverlayLoader";
import useTypedSelector from "../../../hooks/useTypedSelector";
import { selectedUserId, userIsDoctor } from "../../../redux/auth/authSlice";
import {
  useBookAppointmentMutation,
  useGetUserQuery,
} from "../../../redux/api/userSlice";
import ToastAlert from "../../../components/ToastAlert/ToastAlert";

const AppointmentSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  time: Yup.string().required("Time is required"),
});

interface AppointmentForm {
  date: string | null;
  time: string | null;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const loginUserId = useTypedSelector(selectedUserId);
  const isDoctor = useTypedSelector(userIsDoctor);
  const [isAvailable, setIsAvailable] = useState(false);
  const [appointment, setAppointment] = useState("");
  const [formValues] = useState<AppointmentForm>({ date: null, time: null });
  const [toast, setToast] = useState({ message: "", appearence: false, type: "" });

  const handleCloseToast = () => setToast({ ...toast, appearence: false });

  const { data, isLoading } = useGetDoctorQuery({ userId });
  const { data: logedInUserData, isLoading: logedInUserLoading } = useGetUserQuery({ userId: loginUserId });
  const { data: getAppointmentData, isLoading: getAppointmentLoading } = useBookedAppointmentsQuery({ userId });

  const [bookAppointment, { isLoading: appointmentLoading }] = useBookAppointmentMutation();
  const [checkBookingAvailability, { isLoading: checkBookingLoading }] = useCheckBookingAvailabilityMutation();

  const appointmentHandler = async (appointmentData: AppointmentForm) => {
    const payload = {
      doctorId: userId,
      date: appointmentData.date,
      time: appointmentData.time,
    };
    try {
      if (appointment === "checkAvailability") {
        const result: any = await checkBookingAvailability(payload);
        if (result?.data?.status) {
          setIsAvailable(true);
          setToast({ ...toast, message: result.data.message, appearence: true, type: "success" });
        } else {
          setToast({ ...toast, message: result?.error?.data?.message, appearence: true, type: "error" });
        }
      } else if (appointment === "bookAppointment") {
        const result: any = await bookAppointment({
          ...payload,
          userId: loginUserId,
          doctorInfo: data?.data,
          userInfo: logedInUserData?.data,
        });
        if (result?.data?.status) {
          setIsAvailable(false);
          setToast({ ...toast, message: result.data.message, appearence: true, type: "success" });
          setTimeout(() => navigate(isDoctor ? "/doctors/appointments" : "/appointments"), 1500);
        } else {
          setToast({ ...toast, message: result?.error?.data?.message, appearence: true, type: "error" });
        }
      }
    } catch (error) {
      setToast({ ...toast, message: "Something went wrong", appearence: true, type: "error" });
    }
  };

  return (
    <>
      {(isLoading || logedInUserLoading || getAppointmentLoading) && <OverlayLoader />}
      <Navbar>
        <Heading sx={{ fontSize: 28, fontWeight: 600 }}>Book Appointments</Heading>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Heading sx={{ fontSize: 20 }}>Timings</Heading>
                <Box display="flex" alignItems="center" gap={1}>
                  <IoMdTime />
                  <Box>{`${convertToAMPMFormat(data?.data?.fromTime)} to ${convertToAMPMFormat(data?.data?.toTime)}`}</Box>
                </Box>
              </Box>
              <Divider />
              <Formik
                initialValues={formValues}
                onSubmit={appointmentHandler}
                validationSchema={AppointmentSchema}
                enableReinitialize
              >
                {(props: FormikProps<AppointmentForm>) => {
                  const { values, touched, errors, setFieldValue } = props;
                  return (
                    <Form onKeyDown={onKeyDown}>
                      <Box mt={2}>
                        <SubHeading>Select Date</SubHeading>
                        <DatePicker
                          minDate={new Date()}
                          value={values.date}
                          handleChange={(value: any) => {
                            setFieldValue("date", value);
                            setIsAvailable(false);
                          }}
                        />
                        {errors.date && touched.date && (
                          <Box sx={{ color: "#d32f2f", fontSize: "0.75rem" }}>{errors.date}</Box>
                        )}
                      </Box>
                      <Box mt={2}>
                        <SubHeading>Select Time</SubHeading>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            value={values.time}
                            onChange={(value) => {
                              setFieldValue("time", value);
                              setIsAvailable(false);
                            }}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                          />
                        </LocalizationProvider>
                        {errors.time && touched.time && (
                          <Box sx={{ color: "#d32f2f", fontSize: "0.75rem" }}>{errors.time}</Box>
                        )}
                      </Box>
                      <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 3, mb: 2, textTransform: "capitalize" }}
                        onClick={() => setAppointment("checkAvailability")}
                        disabled={checkBookingLoading}
                      >
                        {checkBookingLoading ? "Checking Availability..." : "Check Availability"}
                      </Button>
                      {isAvailable && (
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ textTransform: "capitalize" }}
                          onClick={() => setAppointment("bookAppointment")}
                          disabled={appointmentLoading}
                        >
                          {appointmentLoading ? "Booking..." : "Book Appointment"}
                        </Button>
                      )}
                    </Form>
                  );
                }}
              </Formik>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Heading sx={{ fontSize: 20 }}>{`${data?.data?.prefix} ${data?.data?.fullName}`}</Heading>
              <Divider sx={{ my: 1 }} />
              <Box mt={2}>
                {[{
                  label: "Consultation Time",
                  icon: <IoMdTime />,
                  value: "30 Minutes",
                },
                {
                  label: "Department",
                  icon: <RiLuggageDepositLine />,
                  value: data?.data?.specialization,
                },
                {
                  label: "Experience",
                  icon: <MdOutlineExplicit />,
                  value: `${data?.data?.experience} Years`,
                },
                {
                  label: "Fee Per Visit",
                  icon: <CiMoneyCheck1 />,
                  value: thousandSeparatorNumber(data?.data?.feePerConsultation),
                },
                {
                  label: "Location",
                  icon: <CiLocationOn />,
                  value: data?.data?.address,
                }].map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <Box minWidth={150} display="flex" alignItems="center" gap={1}>
                      {item.icon}
                      {item.label}
                    </Box>
                    <Box>{item.value}</Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {getAppointmentData?.data?.length > 0 && (
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Heading sx={{ fontSize: 20, mb: 1 }}>Booked Appointments</Heading>
                <Divider />
                <Box mt={2}>
                  {getAppointmentData?.data?.map((item: any, idx: number) => (
                    <Box key={idx} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Box minWidth={150}>{formatDate(item?.date)}</Box>
                      <Box
                        sx={{
                          background: "#f0f2f5",
                          color: "#374151",
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          fontSize: 13,
                        }}
                      >
                        {`${formatTime(item?.time)} to ${formatTime(add30Minutes(item?.time))}`}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Navbar>
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </>
  );
};

export default BookAppointment;
