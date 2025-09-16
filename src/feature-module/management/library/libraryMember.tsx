import { useEffect, useRef, useState } from "react";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  cardNo,
  members,
  moreFilter,

} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
import LibraryModal from "./libraryModal";
// import { librarymemberList } from "../../../core/data/json/libraryMemberList";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { getAllLibraryMember } from "../../../service/api";
import { toast } from "react-toastify";

const LibraryMember = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = librarymemberList;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  interface LibraryMember {
    id: number;
    name: string;
    cardno: string;
    email: string;
    date_of_join: string;
    phone_no: string;
    image_url: string;
    folder?: string;
    img_src?: string;

  }


  const [libraryMembers, setLibraryMembers] = useState<LibraryMember[]>([])
  const [loading ,setloading] = useState<boolean>(false)

  const fetchLibraryMember = async () => {
    try {
      setloading(true)
      const { data } = await getAllLibraryMember()
      if (data.success) {
        setLibraryMembers(data.data)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }finally{
      setloading(false)
    }
  }

  useEffect(() => {
    fetchLibraryMember()

  }, [])

  function formatDate(dateStr: string): string {
  const [day, month, year] = dateStr.split("/"); 
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
                  "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day}${months[parseInt(month, 10) - 1]} ${year}`;
}


  const tabledata = libraryMembers.map((item) => ({
    key: item.id,
    id: item.id,
    name:item.name,
    cardNo: item.cardno,
    email: item.email,
    dateOfJoin: formatDate(new Date(item.date_of_join).toLocaleDateString()),
    mobile: item.phone_no,
    img: item.image_url,
  }));


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: number) => (
        <Link to="#" className="link-primary">{text}</Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Member",
      dataIndex: "name",
      render: (text: string, record: any) => (
       
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">
          
            <img
              src={record.img}  //maine image ko direct full url bna diya h backend me hi
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Card No",
      dataIndex: "cardNo",
      sorter: (a: TableData, b: TableData) =>
        a.cardNo.localeCompare(b.cardNo),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: TableData, b: TableData) =>
        a.email.localeCompare(b.email),
    },
    {
      title: "Date Of Join",
      dataIndex: "dateOfJoin",
      sorter: (a: TableData, b: TableData) =>
        a.dateOfJoin.localeCompare(b.dateOfJoin),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      sorter: (a: TableData, b: TableData) =>
        a.mobile.localeCompare(b.mobile),
    },
    {
      title: "Action",
      dataIndex: "key",
      render: (key: number) => (
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <Link
              to="#"
              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-dots-vertical fs-14" />
            </Link>
            <ul className="dropdown-menu dropdown-menu-right p-3">
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#edit_library_members"
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item rounded-1"
                  onClick={()=>handleDelete(key)}
                  data-bs-toggle="modal"
                  data-bs-target="#delete-modal"
                >
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];


  const callFunOnSubmit = ()=>{
     fetchLibraryMember();
  }

  const [deleteMemberId , setDeleteMemberId] = useState<number | null>(null)

  const handleDelete = (id:number)=>{
    setDeleteMemberId(id)
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Library Members</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Library Members
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_library_members"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Member
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Library Members List</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <PredefinedDateRanges />
                </div>
                <div className="dropdown mb-3 me-2">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i className="ti ti-filter me-2" />
                    Filter
                  </Link>
                  <div
                    className="dropdown-menu drop-width"
                    ref={dropdownMenuRef}
                  >
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Member</label>
                              <CommonSelect
                                className="select"
                                options={members}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Card No</label>
                              <CommonSelect
                                className="select"
                                options={cardNo}
                                // defaultValue={cardNo[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={moreFilter}
                                // defaultValue={moreFilter[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-primary"
                          onClick={handleApplyClick}
                        >
                          Apply
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="dropdown mb-3">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-sort-ascending-2 me-2" />
                    Sort by A-Z{" "}
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Ascending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Descending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Viewed
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Added
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {/* Student List */}
              {/* <p>hey this is saurabh</p> */}
              {
                loading?
               <><div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-dark" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div></> 
                :
                <Table dataSource={tabledata} columns={columns} Selection={true} />

              }
          
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
     {tabledata&&( <LibraryModal onAdd={callFunOnSubmit} deleteMemberId = {deleteMemberId} />)}
    </>
  );
};

export default LibraryMember;
