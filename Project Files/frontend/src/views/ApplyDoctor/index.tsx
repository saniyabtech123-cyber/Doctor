import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Form, Formik, FormikProps } from "formik";
import {
  selectedUserEmail,
  selectedUserId,
  selectedUserName,
  selectedUserPhoneNumber,
} from "../../redux/auth/authSlice";
import {
  useDoctorSignupMutation,
  useGetDoctorQuery,
} from "../../redux/api/doctorSlice";
import useTypedSelector from "../../hooks/useTypedSelector";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import PrimaryPhoneInput from "../../components/PhoneInput";
import { Heading, SubHeading } from "../../components/Heading";
import Navbar from "../../components/Navbar";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import OverlayLoader from "../../components/Spinner/OverlayLoader";
import { onKeyDown } from "../../utils";
import { applyDoctorSchema } from "./components/validationSchema";
import {
  FaUserMd,
  FaGlobe,
  FaMapMarkedAlt,
  FaBriefcaseMedical,
  FaMoneyBillAlt,
  FaClock,
} from "react-icons/fa";

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const userEmail = useTypedSelector(selectedUserEmail);
  const userId = useTypedSelector(selectedUserId);
  const userPhoneNumber = useTypedSelector(selectedUserPhoneNumber);
  const userName = useTypedSelector(selectedUserName);

  const [formValues] = useState({
    prefix: "Dr.",
    fullName: userName,
    phoneNumber: userPhoneNumber,
    website: "",
    address: "",
    specialization: "",
    experience: "",
    feePerConsultation: "",
    fromTime: null,
    toTime: null,
  });

  const [toast, setToast] = useState({ message: "", appearence: false, type: "" });
  const handleCloseToast = () => setToast({ ...toast, appearence: false });

  const [applyDoctor, { isLoading }] = useDoctorSignupMutation();
  const { data, isLoading: doctorLoading } = useGetDoctorQuery({ userId });

  const applyDoctorHandler = async (data: any) => {
    try {
      const payload = {
        userId,
        prefix: data.prefix,
        fullName: data.fullName,
        email: userEmail,
        phoneNumber: data.phoneNumber,
        website: data.website,
        address: data.address,
        specialization: data.specialization,
        experience: data.experience,
        feePerConsultation: data.feePerConsultation,
        fromTime: data?.fromTime,
        toTime: data?.toTime,
      };
      const response: any = await applyDoctor(payload);
      if (response?.data?.status) {
        setToast({ message: "Doctor Account Applied Successfully", appearence: true, type: "success" });
        setTimeout(() => navigate("/"), 1500);
      } else if (response?.error) {
        setToast({ message: response?.error?.data?.message, appearence: true, type: "error" });
      }
    } catch (error) {
      setToast({ message: "Something went wrong", appearence: true, type: "error" });
    }
  };

  return (
    <>
      {doctorLoading && <OverlayLoader />}
      <Navbar>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Heading sx={{ mb: 4, color: "#1a2c5b", fontWeight: 700 }}>
            Apply For Doctor Account
          </Heading>
          {data?.data?.status ? (
            <Paper
              sx={{
                p: 3,
                background: "#e0f2f7",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                textAlign: "center",
                color: "#1a2c5b",
                fontWeight: 600,
              }}
            >
              You already applied. Please wait for Admin Approval.
            </Paper>
          ) : (
            <Paper
              sx={{
                mt: 2,
                p: { xs: 3, md: 5 },
                background: "#ffffff",
                borderRadius: 3,
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Formik
                initialValues={formValues}
                onSubmit={applyDoctorHandler}
                validationSchema={applyDoctorSchema}
              >
                {(props: FormikProps<any>) => {
                  const { values, touched, errors, handleBlur, handleChange, setFieldValue } = props;
                  return (
                    <Form onKeyDown={onKeyDown}>
                      <SubHeading sx={{ mb: 3, color: "#333333", display: 'flex', alignItems: 'center' }}>
                        <FaUserMd style={{ marginRight: 10, fontSize: '1.2em', color: '#0056b3' }} /> Basic Information
                      </SubHeading>
                      <Grid container spacing={4} mb={4}>
                        <Grid item xs={12} md={4}>
                          <PrimaryInput
                            label="Prefix"
                            name="prefix"
                            placeholder="Prefix"
                            value={values.prefix}
                            readOnly
                            sx={{ '& .MuiInputBase-input.Mui-readOnly': { backgroundColor: '#f0f4f8', cursor: 'not-allowed', borderRadius: 1 } }}
                            helperText={typeof errors.prefix === "string" && touched.prefix ? errors.prefix : ""}
                            error={!!(touched.prefix && errors.prefix)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <PrimaryInput
                            label="Full Name"
                            name="fullName"
                            placeholder="Full Name"
                            value={values.fullName}
                            readOnly
                            sx={{ '& .MuiInputBase-input.Mui-readOnly': { backgroundColor: '#f0f4f8', cursor: 'not-allowed', borderRadius: 1 } }}
                            helperText={typeof errors.fullName === "string" && touched.fullName ? errors.fullName : ""}
                            error={!!(touched.fullName && errors.fullName)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <PrimaryPhoneInput
                            value={values.phoneNumber}
                            name="phoneNumber"
                            formik={props}
                            label="Phone"
                            readOnly
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <PrimaryInput
                            label="Website"
                            name="website"
                            placeholder="Website"
                            value={values.website}
                            helperText={typeof errors.website === "string" && touched.website ? errors.website : ""}
                            error={!!(touched.website && errors.website)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            startAdornment={<FaGlobe style={{ color: '#555555' }} />}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <PrimaryInput
                            label="Address"
                            name="address"
                            placeholder="Address"
                            value={values.address}
                            helperText={typeof errors.address === "string" && touched.address ? errors.address : ""}
                            error={!!(touched.address && errors.address)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            startAdornment={<FaMapMarkedAlt style={{ color: '#555555' }} />}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 4, borderColor: '#e0e0e0' }} />

                      <SubHeading sx={{ mb: 3, color: "#333333", display: 'flex', alignItems: 'center' }}>
                        <FaBriefcaseMedical style={{ marginRight: 10, fontSize: '1.2em', color: '#0056b3' }} /> Professional Information
                      </SubHeading>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                          <PrimaryInput
                            label="Specialization"
                            name="specialization"
                            placeholder="Specialization"
                            value={values.specialization}
                            helperText={typeof errors.specialization === "string" && touched.specialization ? errors.specialization : ""}
                            error={!!(touched.specialization && errors.specialization)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <PrimaryInput
                            label="Experience (Years)"
                            name="experience"
                            placeholder="Experience"
                            type="number"
                            value={values.experience}
                            helperText={typeof errors.experience === "string" && touched.experience ? errors.experience : ""}
                            error={!!(touched.experience && errors.experience)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <PrimaryInput
                            label="Fee Per Consultation"
                            name="feePerConsultation"
                            placeholder="Fee Per Consultation"
                            type="number"
                            value={values.feePerConsultation}
                            helperText={typeof errors.feePerConsultation === "string" && touched.feePerConsultation ? errors.feePerConsultation : ""}
                            error={!!(touched.feePerConsultation && errors.feePerConsultation)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            startAdornment={<FaMoneyBillAlt style={{ color: '#555555' }} />}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack spacing={2}>
                              <TimePicker
                                label="Start Time"
                                value={values.fromTime}
                                onChange={(value) => setFieldValue("fromTime", value)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={!!(touched.fromTime && errors.fromTime)}
                                    helperText={touched.fromTime && errors.fromTime ? String(errors.fromTime) : ''}
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                        <FaClock style={{ color: '#555555', marginRight: 8 }} />
                                      ),
                                    }}
                                  />
                                )}
                              />
                            </Stack>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack spacing={2}>
                              <TimePicker
                                label="End Time"
                                value={values.toTime}
                                onChange={(value) => setFieldValue("toTime", value)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={!!(touched.toTime && errors.toTime)}
                                    helperText={touched.toTime && errors.toTime ? String(errors.toTime) : ''}
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                        <FaClock style={{ color: '#555555', marginRight: 8 }} />
                                      ),
                                    }}
                                  />
                                )}
                              />
                            </Stack>
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                      <Box sx={{ textAlign: "right", mt: 5 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isLoading}
                          sx={{
                            px: 5,
                            py: 1.8,
                            borderRadius: 2.5,
                            textTransform: "uppercase",
                            fontWeight: 600,
                            fontSize: '1.05rem',
                            backgroundColor: "#0056b3",
                            '&:hover': {
                              backgroundColor: "#004085",
                            },
                            boxShadow: "0 4px 15px rgba(0,86,179,0.3)",
                          }}
                        >
                          {isLoading ? "Applying..." : "Apply Now"}
                        </Button>
                      </Box>
                    </Form>
                  );
                }}
              </Formik>
            </Paper>
          )}
        </Box>
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

export default ApplyDoctor;
