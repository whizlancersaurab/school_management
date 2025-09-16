import { useEffect, useRef, useState } from "react";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import {
  allSubject,
  cardNo,

  moreFilterBook,

} from "../../../core/common/selectoption/selectoption";
import type { TableData } from "../../../core/data/interface";
import Table from "../../../core/common/dataTable/index";
import TooltipOption from "../../../core/common/tooltipOption";
import LibraryModal from "./libraryModal";
// import { bookList } from "../../../core/data/json/bookList";
import { getallbook } from "../../../service/api";
import { toast } from "react-toastify";



export interface Book {
  id: number;
  bookName: string;
  bookNo: string;
  author: string;
  publisher: string;
  subject: string;
  price: string;
  qty: string;
  rackNo: string;
  postDate: string; 
  available: string;
}


const Books = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  // const data = bookList;
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const [allBooks , setAllBooks] = useState<Book[]>([])
  const [loading ,setLoading] = useState<boolean>(false)
  
  const fetchBooks = async()=>{
    setLoading(true)

    try {
    await new Promise((res)=>setTimeout(res, 400))
      const {data} = await getallbook()
      console.log(data)
      if(data.success){
        setAllBooks(data.data)
      }
      
    } catch (error:any) {
      console.log(error)
      toast.error(error.response.data.message)
      
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchBooks()

  } , [])

  const onAddBook = ()=>{
    fetchBooks();
  }


  const tableData = allBooks.map((item)=>({
    key:item.id,
    id:item.id,
    bookName:item.bookName,
    bookNo:item.bookNo,
    publisher:item.publisher,
    author:item.author,
    subject:item.subject,
    rackNo:item.rackNo,
    qty:item.qty,
    available:item.available,
    price:item.price,
    postDate:item.postDate
  }))



  // const tableData =  

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id - b.id,
    },
    {
      title: "Book Name",
      dataIndex: "bookName",
      
      sorter: (a: TableData, b: TableData) =>
        a.bookName.length - b.bookName.length,
    },
    {
      title: "Book No",
      dataIndex: "bookNo",
      sorter: (a: TableData, b: TableData) =>
        a.bookNo.length - b.bookNo.length,
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      sorter: (a: TableData, b: TableData) =>
        a.publisher.length - b.publisher.length,
    },
    {
      title: "Author",
      dataIndex: "author",
      
      sorter: (a: TableData, b: TableData) => a.author.length - b.author.length,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      
      sorter: (a: TableData, b: TableData) => a.subject.length - b.subject.length,
    },
    {
      title: "Rack No",
      dataIndex: "rackNo",
      
      sorter: (a: TableData, b: TableData) => a.rackNo.length - b.rackNo.length,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      
      sorter: (a: TableData, b: TableData) => a.qty.length - b.qty.length,
    },
    {
      title: "Available",
      dataIndex: "available",
      
      sorter: (a: TableData, b: TableData) => a.available.length - b.available.length,
    },
    {
      title: "Price",
      dataIndex: "price",
      
      sorter: (a: TableData, b: TableData) => a.price.length - b.price.length,
    },
    {
      title: "Post Date",
      dataIndex: "postDate",
      
      sorter: (a: TableData, b: TableData) => a.postDate.length - b.postDate.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <>
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
                    data-bs-target="#edit_library_book"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ];

  
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Books</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Management</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Books
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
                  data-bs-target="#add_library_book"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Book
                </Link>
              </div>
              
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Books</h4>
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
                              <label className="form-label">Book No</label>
                              <CommonSelect
                                className="select"
                                options={cardNo}
                                defaultValue={undefined}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Subject</label>
                              <CommonSelect
                                className="select"
                                options={allSubject}
                                defaultValue={allSubject[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={moreFilterBook}
                                defaultValue={moreFilterBook[0]}
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
                    {
                      loading? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) :( <Table dataSource={tableData} columns={columns} Selection={true} />)
                    }
              {/* /Student List */}
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <LibraryModal onAdd={onAddBook} deleteMemberId={null} />
    </>
  );
};

export default Books;
