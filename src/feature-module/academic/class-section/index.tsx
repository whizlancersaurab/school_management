import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Core imports
import Table from "../../../core/common/dataTable";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import TooltipOption from "../../../core/common/tooltipOption";

// Data & API
import { all_routes } from "../../router/all_routes";
import { activeList } from "../../../core/common/selectoption/selectoption";
import { getAllSection, addClassSection } from "../../../service/api";

// ✅ Interfaces
interface AllSection {
  id: number;
  section: string;
  status: string;
}

interface TableData {
  key: number;
  id: number;
  sectionName: string;
  status: string;
}

interface SectionData {
  section: string;
  status: string;
}

const ClassSection: React.FC = () => {
  const routes = all_routes;

  // 🔹 State
  const [allSections, setAllSections] = useState<AllSection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sectionData, setSectionData] = useState<SectionData>({
    section: "",
    status: "0",
  });

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Fetch Sections
  const fetchSection = async () => {
    try {
      setLoading(true);
      const { data } = await getAllSection();

      if (data.success) {
        setAllSections(data.data);
      }
    } catch (error: any) {
      console.error(error);
      toast.warning(error.response?.data?.message || "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  // 🔹 Table Data
  const tableData: TableData[] = allSections.map((item) => ({
    key: item.id,
    id: item.id,
    sectionName: item.section,
    status: item.status === "1" ? "Active" : "Inactive",
  }));

  // 🔹 Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a: TableData, b: TableData) => a.id - b.id,
      render: (id: number) => <Link to="#" className="link-primary">{id}</Link>,
    },
    {
      title: "Section Name",
      dataIndex: "sectionName",
      sorter: (a: TableData, b: TableData) =>
        a.sectionName.localeCompare(b.sectionName),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a: TableData, b: TableData) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <span
          className={`badge d-inline-flex align-items-center ${
            status === "Active"
              ? "badge-soft-success"
              : "badge-soft-danger"
          }`}
        >
          <i className="ti ti-circle-filled fs-5 me-1" />
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
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
                data-bs-target="#edit_class_section"
              >
                <i className="ti ti-edit-circle me-2" /> Edit
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item rounded-1"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
              >
                <i className="ti ti-trash-x me-2" /> Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  // 🔹 Form Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSectionData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await addClassSection(sectionData);
      if (data.success) {
        toast.success(data.message);
        setSectionData({ section: "", status: "0" });
        fetchSection();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add section");
    }
  };

  const handleApplyClick = () => {
    dropdownMenuRef.current?.classList.remove("show");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* 🔹 Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Sections</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Academic</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Sections
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
                data-bs-target="#add_class_section"
              >
                <i className="ti ti-square-rounded-plus-filled me-2" />
                Add Section
              </Link>
            </div>
          </div>
        </div>

        {/* 🔹 Table Card */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Class Section</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <PredefinedDateRanges />
              </div>

              {/* Filter */}
              <div className="dropdown mb-3 me-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-filter me-2" /> Filter
                </Link>
                <div
                  className="dropdown-menu drop-width"
                  ref={dropdownMenuRef}
                >
                  <form>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 border-bottom pb-0">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <CommonSelect className="select" options={activeList} />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Status</label>
                            <CommonSelect
                              className="select"
                              options={activeList}
                              defaultValue={activeList[0]}
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

              {/* Sort */}
              <div className="dropdown mb-3">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-sort-ascending-2 me-2" /> Sort by A-Z
                </Link>
                <ul className="dropdown-menu p-3">
                  <li><Link to="#" className="dropdown-item rounded-1 active">Ascending</Link></li>
                  <li><Link to="#" className="dropdown-item rounded-1">Descending</Link></li>
                  <li><Link to="#" className="dropdown-item rounded-1">Recently Viewed</Link></li>
                  <li><Link to="#" className="dropdown-item rounded-1">Recently Added</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="card-body p-0 py-3">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Table columns={columns} dataSource={tableData} Selection />
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Add Section Modal */}
      <div className="modal fade" id="add_class_section">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h4 className="modal-title">Add Section</h4>
                <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal">
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Section</label>
                  <input
                    type="text"
                    className="form-control"
                    name="section"
                    value={sectionData.section}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="status-title">
                    <h5>Status</h5>
                    <p>Change the Status by toggle</p>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="status"
                      checked={sectionData.status === "1"}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 🔹 Edit & Delete Modals can remain same as yours */}
    </div>
  );
};

export default ClassSection;
