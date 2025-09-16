import axios from 'axios'

const baseUrl: string = '/api'
export const Imageurl = `http://localhost:3004/api/stu/uploads/image/`
export const Documenturl = `http://localhost:3004/api/stu/uploads/document/`

export const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

export const api2 = axios.create({
    baseURL: baseUrl,
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true
})



// student apis-------------------
export const addStundent = (data: Object) => api.post('/stu/add', data)
export const allStudents = () => api.get('/stu/')
export const specificStudentData1 = (id:number)=>api.get(`/stu/${id}`)
export const getStuTimeTable = (id:number)=>api.get(`/stu/timetable/${id}`)
export const uploadStudentFile = (data: object) => api2.post('/stu/upload', data)
export const deleteFile = (id:Number)=>api.delete(`/stu/deletefile/${id}`)

//student leave routes
export const addLeave = (data:object)=>api.post('/stu/addleave' , data)
export const getLeaveData = (rollnum:number)=>api.get(`/stu/leavedata/${rollnum}`)

// leave 
export const getAllLeaveTypeData = ()=>api.get('/leave/allleavetype')
export const addLeaveType = (data:object)=>api.post('/leave/addleavetype' , data)


// class section-----------------------
export const getAllSection = ()=>api.get('/section')
export const addClassSection = (data:object)=>api.post('/section/addclasssection' , data)

// class sbject-----------------------------
export const addSubject = (data:object)=>api.post('/subject/addsubject' , data)
export const getAllSubject = ()=>api.get('/subject')


// table routes-----------------------------
export const addTimeTable = (data:object)=>api.post('/table/addtimetable' , data)
export const getTimeTable = ()=>api.get('/table/gettimetable')


// library routes-------------------------------------

export const addLibrarymember = (data:object)=>api2.post('/library/addlibrarymember' , data)
export const getAllLibraryMember = ()=>api.get('/library')

export const adddBookInLibrary = (data:object)=>api2.post('/library/addbook' , data)
export const getallbook = ()=>api.get('/library/allbook')

export const getStuIssueBookData = (rollnum:number)=>api.get(`/library//stuissuebookdata/${rollnum}`)

export const stuDataForIssueBook = ()=>api.get('/library/studataforissuebook')
export const bookDataForIssueBook = ()=>api.get('/library/bookdataforissuebook')
export const issuBookToStu = (data:object)=>api.post('/library/issuebook' , data)
export const getAllStuIssueBook = ()=>api.get('/library/getallstuissuebook')

export const speStuNotReturnBookData = (rollnum:number)=>api.get(`/library/spestunotretubookdata/${rollnum}`)
export const returnBook = (data:object)=>api.patch('/library/returnbook' , data)



// attendance routes----------------------------
export const markAttendance = (data:object)=>api.post('/attendance/markattendance' , data)
export const getStuAttendanceData = (rollnum:any)=>api.get(`/attendance/getattendancedetail/${rollnum}`)



// student fees ------------------------------
export const studentDetForFees=(id:any)=>api.get(`/fees/studetforfees/${id}`)
// feesgroupname
export const allFeesGroupName = ()=>api.get('/fees/allfeesformgroup')
export const addFeesGroupName = (data:object)=>api.post('/fees/addfeesformgroup' , data)

// feestypename
export const allFeesTypeName = ()=>api.get('/fees/allfeesformtype')
export const addFeesTypeName = (data:object)=>api.post('/fees/addfeesformtype' , data)

// master fees
export const allFeesMaster= ()=>api.get('/fees/allfeesmaster')
export const addFeesMaster = (data:object)=>api.post('/fees/addfeesmaster' , data)

export const feesAssignToStudents = (data:object)=>api.post('/fees/feesassign' , data)
export const getAllFeeAssignDetails = ()=>api.get('/fees/allassigndetails')
export const stuFeesSubmit = (data:object)=>api.post('/fees/feessubmit'  ,data)

export const getFeesDetailsSpecStudent = (rollnum:number)=>api.get(`/fees/getfeesdetailsspestu/${rollnum}`)
export const getFeesCollectionDet = ()=>api.get('/fees/getfeescollection')

// exam --------------------------------------------------------------------
export const addExamName = (data:object)=>api.post('/exam/addexam' , data)
export const allExamData = ()=>api.get('/exam/allexamdata')
export const deleteExam = (id:number)=>api.delete(`/exam/deleteexam/${id}`)

// exam schedule
export const addExamSchedule = (data:object)=>api.post('/exam/addexamschedule' , data)
export const allExamSchedule= ()=>api.get('/exam/allscheduledata')

// exam grade
export const addExamGrade =(data:object)=>api.post('/exam/addgrade' , data)
export const allExamGrade = ()=>api.get('/exam/allgrade')

// academic reasons==========================================================
export const addAcademicReason = (data:object)=>api.post('/reason/addreason' ,data)
export const allAcademicReason =()=>api.get('/reason/allreason')
export const deleteReason = (id:number)=>api.delete(`/reason/deletereason/${id}`)






// parents routes=====================================================parents routes
// =======================================================================
export const allParents = ()=>api.get('/parent/allparents')
export const speParent = (parentId:number)=>api.get(`/parent/speparent/${parentId}`)

// guardian routes
export const allGuardians = ()=>api.get('/parent//allguardians')
export const speGuardian = (guaId:number)=>api.get(`/parent/speguardian//${guaId}`)


// teacher==================================================================================
export const addTeacher = (data:Object)=>api.post('/teacher/addteacher' , data)
export const allTeachers = ()=>api.get('/teacher/allteacher')
export const allTeacherForOption = ()=>api.get('/teacher/teachersforoption')
export const sepTeacher = (userId:string)=>api.get(`/teacher/speteacher/${userId}`)

export const uploadTeacherFile = (data: object) => api2.post('/teacher/upload', data)
export const deleteTeacherFile = (id:Number)=>api.delete(`/teacher/deletefile/${id}`)

// homwwork===============================================================================
export const addHomeWork = (data:object)=>api.post('/homework/addhomework' , data)
export const allHomeWork = ()=>api.get('/homework/allhomework')

// auth ===================================================================================
export const login = (data:object)=>api.post('/auth/login' , data)
export const forgotPassword = (email:object)=>api.post('/auth/forgot-password' , email)
export const resetPassword = (data:object)=>api.post('/auth/reset-password' , data)

