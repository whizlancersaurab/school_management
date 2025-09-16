
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import Table from "../../../../core/common/dataTable/index";
import type { TableData } from "../../../../core/data/interface";
// import { leaveData } from "../../../../core/data/json/leaveData";
import { Attendance } from "../../../../core/data/json/attendance";
import { useEffect, useState } from "react";
import { getLeaveData, getStuAttendanceData, specificStudentData1 } from "../../../../service/api";
import dayjs from "dayjs";
import { Skeleton } from "antd";
import { toast } from "react-toastify";

const StudentLeaves = () => {
  const routes = all_routes;
  // const data = leaveData;
  const data2 = Attendance;

  interface LeaveInform {
    id: number;
    name: string;
    total_allowed: number;
    used: number;
    avilable: number;
  }

  const { id } = useParams<{ id: string }>();

  const [student, setStudent] = useState<any>({})
  const [leaveInform, setLeaveInform] = useState<LeaveInform[]>([])
  const [leaveDataa, setLeaveDataa] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [token ,setToken] = useState<string|null>(null)


  // ✅ Student API function
const fetchStudent = async (studentId: number) => {
  try {
    const res = await specificStudentData1(studentId);

    if (res?.data?.success) {
      setStudent(res.data.student);
      return res.data.student; 
    } else {
      console.warn("Failed to fetch student data");
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching student data:", error);
    return null;
  }
};

// ✅ Leave API function
const fetchLeave = async (rollnum: number) => {
  try {
    const res = await getLeaveData(rollnum);

    if (res?.data?.success) {
      setLeaveInform(res.data.leave_inform);
      setLeaveDataa(res.data.stuAllLeave);
    } else {
      console.warn("Failed to fetch leave data");
      setLeaveDataa([]);
    }
  } catch (error) {
    console.error("❌ Error fetching leave data:", error);
    setLeaveDataa([]);
  }
};

// ✅ Combined function (useEffect ya button click se call hoga)
const fetchStudentAndLeave = async () => {
  setLoading(true);
  try {
    await new Promise((res)=>setTimeout(res, 200))
    const studentData = await fetchStudent(Number(id));

    // Agar student mila to uska rollnum se leave data fetch karo
    if (studentData?.rollnum) {
      await fetchLeave(Number(studentData.rollnum));
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  } finally {
    setLoading(false);
  }
};

// ✅ Example: useEffect me call
useEffect(() => {
  setToken(localStorage.getItem('token'))
  if (id) {
    fetchStudentAndLeave();
  }
}, [id]);


  const handleAdd = () => {
    fetchStudentAndLeave()
  }



  const tableData = leaveDataa.map((item:any) => ({
    key: item.id,
    leaveType: item.leave_type,
    leaveDate: `${dayjs(item.from_date).format("DD-MM-YYYY")} to ${dayjs(
      item.to_date
    ).format("DD-MM-YYYY")}`,
    noOfDays: String(item.no_of_days),
    appliedOn: dayjs(item.applied_on).format("DD-MM-YYYY"),
    status: item.status == "1" ? "Approved" : "Pending",
  }));


  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      sorter: (a: TableData, b: TableData) =>
        a.leaveType.length - b.leaveType.length,
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      sorter: (a: TableData, b: TableData) =>
        a.leaveDate.length - b.leaveDate.length,
    },
    {
      title: "No of Days",
      dataIndex: "noOfDays",
      sorter: (a: TableData, b: TableData) =>
        parseFloat(a.noOfDays) - parseFloat(b.noOfDays),
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      sorter: (a: TableData, b: TableData) =>
        a.appliedOn.length - b.appliedOn.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Approved" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },
  ];


  interface AttendanceData {
    id: number;
    attendance: string;
    attendance_date_info: string;


  }


  const [attendanceSummary, setAttendanceSummary] = useState<any>({})
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  


  const fetchStudentAttendance = async (rollnum: string) => {
    try {
      // console.log(rollnum)

      const { data } = await getStuAttendanceData(rollnum)
      // console.log(data.details)
      setAttendanceSummary(data.summary)
      setAttendanceData(data.details)

    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.success)
    }

  }



  function getOnlyDay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.getDate().toString().padStart(2, "0");
  }

  const getMonth = (dateStr: string) => {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    return monthNames[new Date(dateStr).getMonth()];
  };


  const tabledata2: any[] = [];

  attendanceData.forEach((item) => {
    const day = getOnlyDay(item.attendance_date_info);
    const month = getMonth(item.attendance_date_info);

    // Find if a row for this day already exists
    let row = tabledata2.find((r) => r.date === day);
    if (!row) {
      row = { key: day, date: day };
      tabledata2.push(row);
    }


    row[month] = item.attendance;
  });



  const columns2 = [
    {
      title: "Date | Month",
      dataIndex: "date",
      sorter: (a: TableData, b: TableData) => a.date.localeCompare(b.date),
    },
    {
      title: "Jan",
      dataIndex: "jan",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.jan.localeCompare(b.jan),
    },
    {
      title: "Feb",
      dataIndex: "feb",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.feb.localeCompare(b.feb),
    },
    {
      title: "Mar",
      dataIndex: "mar",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.mar.localeCompare(b.mar),
    },
    {
      title: "Apr",
      dataIndex: "apr",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.apr.localeCompare(b.apr),
    },
    {
      title: "May",
      dataIndex: "may",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.may.localeCompare(b.may),
    },
    {
      title: "Jun",
      dataIndex: "jun",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.jun.localeCompare(b.jun),
    },
    {
      title: "Jul",
      dataIndex: "jul",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.jul.localeCompare(b.jul),
    },
    {
      title: "Aug",
      dataIndex: "aug",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.aug.localeCompare(b.aug),
    },
    {
      title: "Sep",
      dataIndex: "sep",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.sep.localeCompare(b.sep),
    },
    {
      title: "Oct",
      dataIndex: "oct",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.oct.localeCompare(b.oct),
    },
    {
      title: "Nov",
      dataIndex: "nov",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.nov.localeCompare(b.nov),
    },
    {
      title: "Dec",
      dataIndex: "dec",
      render: (text: string) => (
        <>
          {text === "Present" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "Holiday" ? (
            <span className="attendance-range bg-pending"></span>
          ) : text === "Halfday" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "Late" ? (
            <span className="attendance-range bg-info"></span>
          ) : (
            <span className="attendance-range bg-danger"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.dec.localeCompare(b.dec),
    },
  ];





  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {token&&( <StudentBreadcrumb token={token} />)}
            {/* /Page Header */}
          </div>
          <div className="row">
            {/* Student Information */}
            <StudentSidebar student={student} loading={loading} />
            {/* /Student Information */}
            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                    <li>
                      <Link to={`${routes.studentDetail}/${id}`} className="nav-link">
                        <i className="ti ti-school me-2" />
                        Student Details
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.studentTimeTable}/${id}`} className="nav-link">
                        <i className="ti ti-table-options me-2" />
                        Time Table
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.studentLeaves}/${id}`} className="nav-link active">
                        <i className="ti ti-calendar-due me-2" />
                        Leave &amp; Attendance
                      </Link>

                    </li>
                    <li>
                      <Link to={`${routes.studentFees}/${id}`} className="nav-link">
                        <i className="ti ti-report-money me-2" />
                        Fees
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.studentResult}/${id}`} className="nav-link">
                        <i className="ti ti-bookmark-edit me-2" />
                        Exam &amp; Results
                      </Link>
                    </li>
                    <li>
                      <Link to={`${routes.studentLibrary}/${id}`} className="nav-link">
                        <i className="ti ti-books me-2" />
                        Library
                      </Link>
                    </li>
                  </ul>
                  {/* /List */}
                  {/* Leave Nav*/}
                  <div className="card">
                    <div className="card-body pb-1">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded-fill">
                        <li className="me-3 mb-3">
                          <Link
                            to="#"
                            className="nav-link active rounded fs-12 fw-semibold"
                            data-bs-toggle="tab"
                            data-bs-target="#leave"
                          >
                            Leaves
                          </Link>
                        </li>
                        <li className="mb-3">
                          {student && (<button
                            onClick={() => fetchStudentAttendance(student.rollnum)}
                            className="nav-link rounded fs-12 fw-semibold"
                            data-bs-toggle="tab"
                            data-bs-target="#attendance"
                          >
                            Attendance
                          </button>)}
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Leave Nav*/}
                  <div className="tab-content">
                    {/* Leave */}
                    <div className="tab-pane fade show active" id="leave">
                      <div className="row gx-3">

                        {
                          loading ?
                            Array.from({ length: 4 }).map((_, index) => (
                              <div key={index} className="col-lg-6 col-xxl-3 d-flex">
                                <div className="card flex-fill">
                                  <div className="card-body">
                                    <h5 className="mb-2">
                                      <Skeleton.Input active size="small" style={{ width: 150 }} />
                                    </h5>
                                    <div className="d-flex align-items-center flex-wrap">
                                      <span className="pe-2 me-2 mb-0 d-inline-block">
                                        <Skeleton.Input active size="small" style={{ width: 80 }} />
                                      </span>
                                      <span className="mb-0 d-inline-block">
                                        <Skeleton.Input active size="small" style={{ width: 100 }} />
                                      </span>

                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                            :
                            leaveInform && leaveInform.map((item) => (
                              <div key={item.id} className="col-lg-6 col-xxl-3 d-flex">
                                <div className="card flex-fill">
                                  <div className="card-body">
                                    <h5 className="mb-2 text-capitalize">{`${item.name} (${item.total_allowed})`}</h5>
                                    <div className="d-flex align-items-center flex-wrap">
                                      <p className="border-end pe-2 me-2 mb-0">
                                        Used : {item.used}
                                      </p>
                                      <p className="mb-0">Available : {item.avilable}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                        }


                      </div>
                      <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                          <h4 className="mb-3">Leaves</h4>
                          <Link
                            to="#"
                            data-bs-target="#apply_leave"
                            data-bs-toggle="modal"
                            className="btn btn-primary d-inline-flex align-items-center mb-3"
                          >
                            <i className="ti ti-calendar-event me-2" />
                            Apply Leave
                          </Link>
                        </div>
                        {/* Leaves List */}
                        <div className="card-body p-0 py-3">

                          {
                            loading ?
                              <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </div> : <Table
                                dataSource={tableData}
                                columns={columns}
                                Selection={false}
                              />
                          }

                        </div>
                        {/* /Leaves List */}
                      </div>
                    </div>
                    {/* /Leave */}
                    {/* Attendance */}
                    <div className="tab-pane fade" id="attendance">
                      <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-1">
                          <h4 className="mb-3">Attendance</h4>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="d-flex align-items-center flex-wrap me-3">
                              <p className="text-dark mb-3 me-2">
                                Last Updated on : 25 May 2024
                              </p>
                              <Link
                                to="#"
                                className="btn btn-primary btn-icon btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0 mb-3"
                              >
                                <i className="ti ti-refresh-dot" />
                              </Link>
                            </div>
                            <div className="dropdown mb-3">
                              <Link
                                to="#"
                                className="btn btn-outline-light bg-white dropdown-toggle"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                              >
                                <i className="ti ti-calendar-due me-2" />
                                Year : 2024 / 2025
                              </Link>
                              <ul className="dropdown-menu p-3">
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    Year : 2024 / 2025
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    Year : 2023 / 2024
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    Year : 2022 / 2023
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="card-body pb-1">
                          <div className="row">
                            {/* Total Present */}
                            <div className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                                <span className="avatar avatar-lg bg-primary-transparent rounded me-2 flex-shrink-0 text-primary">
                                  <i className="ti ti-user-check fs-24" />
                                </span>
                                <div className="ms-2">
                                  <p className="mb-1">Present</p>
                                  <h5>{attendanceSummary?.Present ?? 0}</h5>
                                </div>
                              </div>
                            </div>
                            {/* /Total Present */}
                            {/* Total Absent */}
                            <div className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                                <span className="avatar avatar-lg bg-danger-transparent rounded me-2 flex-shrink-0 text-danger">
                                  <i className="ti ti-user-check fs-24" />
                                </span>
                                <div className="ms-2">
                                  <p className="mb-1">Absent</p>
                                  <h5>{attendanceSummary?.Absent ?? 0}</h5>
                                </div>
                              </div>
                            </div>
                            {/* /Total Absent */}
                            {/* Half Day */}
                            <div className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                                <span className="avatar avatar-lg bg-info-transparent rounded me-2 flex-shrink-0 text-info">
                                  <i className="ti ti-user-check fs-24" />
                                </span>
                                <div className="ms-2">
                                  <p className="mb-1">Half Day</p>
                                  <h5>{attendanceSummary?.Halfday ?? 0}</h5>
                                </div>
                              </div>
                            </div>
                            {/* /Half Day */}
                            {/* Late to School*/}
                            <div className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                                <span className="avatar avatar-lg bg-warning-transparent rounded me-2 flex-shrink-0 text-warning">
                                  <i className="ti ti-user-check fs-24" />
                                </span>
                                <div className="ms-2">
                                  <p className="mb-1">Late</p>
                                  <h5>{attendanceSummary?.Late ?? 0}</h5>
                                </div>
                              </div>
                            </div>
                            {/* /Late to School*/}
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-1">
                          <h4 className="mb-3">Leave &amp; Attendance</h4>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="dropdown mb-3 me-3">
                              <Link
                                to="#"
                                className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                                data-bs-toggle="dropdown"
                              >
                                <i className="ti ti-calendar-due me-2" />
                                This Year
                              </Link>
                              <ul className="dropdown-menu p-3">
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    This Year
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    This Month
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    This Week
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="dropdown mb-3">
                              <Link
                                to="#"
                                className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                                data-bs-toggle="dropdown"
                              >
                                <i className="ti ti-file-export me-2" />
                                Export
                              </Link>
                              <ul className="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    <i className="ti ti-file-type-pdf me-2" />
                                    Export as PDF
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="#"
                                    className="dropdown-item rounded-1"
                                  >
                                    <i className="ti ti-file-type-xls me-2" />
                                    Export as Excel{" "}
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="card-body p-0 py-3">
                          <div className="px-3">
                            <div className="d-flex align-items-center flex-wrap">
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-success rounded me-2 flex-shrink-0 ">
                                  <i className="ti ti-checks" />
                                </span>
                                <p className="text-dark">Present</p>
                              </div>
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-danger rounded me-2 flex-shrink-0 ">
                                  <i className="ti ti-x" />
                                </span>
                                <p className="text-dark">Absent</p>
                              </div>
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-info rounded me-2 flex-shrink-0 ">
                                  <i className="ti ti-clock-x" />
                                </span>
                                <p className="text-dark">Late</p>
                              </div>
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-dark rounded me-2 flex-shrink-0 ">
                                  <i className="ti ti-calendar-event" />
                                </span>
                                <p className="text-dark">Halfday</p>
                              </div>
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-pending rounded me-2 flex-shrink-0 ">
                                  <i className="ti ti-calendar-event" />
                                </span>
                                <p className="text-dark">Holiday</p>
                              </div>
                            </div>
                          </div>
                          {/* Attendance List */}

                          {tabledata2.length > 0 && (<Table
                            dataSource={tabledata2}
                            columns={columns2}
                            Selection={false}
                          />)}
                          {/* /Attendance List */}
                        </div>
                      </div>
                    </div>
                    {/* /Attendance */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {student.rollnum && (<StudentModals onAdd={handleAdd} rollnum={Number(student.rollnum)} />)}
    </>
  );
};

export default StudentLeaves;
