import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, parse, subDays } from "date-fns";
import styles from "./order.module.css"
type AllOrders = {
  orderCode: string;
  status: string;
  quantity: number;
  totalAmount: number;
  datecreated: string;
  deadline: string;
};
function Orders() {

  const [activeButton, setActiveButton] = useState('all');
  const [selectedOrderCode, setSelectedOrderCode] = useState('');
  const [searchOrder, setSearchOrder] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [thirtyDaysAgo, setThirtyDaysAgo] = useState(subDays(new Date(), 30));
  const formattedThirtyDaysAgo = thirtyDaysAgo.toLocaleDateString();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [allOrders, setAllOrders] = useState<AllOrders[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<AllOrders[]>([]);
  const [filterClicked, setFilterClicked] = useState(false);
  const [filterCleared, setFilterCleared] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);



  useEffect(() => {
    const Orders = [
      {
        orderCode: "ORD001",
        status: "Chờ xác nhận",
        quantity: 2,
        totalAmount: 100,
        datecreated: "03/06/2021",
        deadline: "03/06/2023",
      },
      {
        orderCode: "ORD002",
        status: "Đang xử lí",
        quantity: 3,
        totalAmount: 150,
        datecreated: "03/06/2023",
        deadline: "03/06/2023",
      },
      {
        orderCode: "ORD003",
        status: "Đang xử lí",
        quantity: 3,
        totalAmount: 150,
        datecreated: "03/06/2023",
        deadline: "03/06/2023",
      },
      {
        orderCode: "ORD004",
        status: "Chờ xác nhận",
        quantity: 3,
        totalAmount: 150,
        datecreated: "03/06/2023",
        deadline: "03/06/2023",
      },
    ];
    setAllOrders(Orders);
  }, []);

  useEffect(() => {
    let filtered = allOrders;
    if (activeButton !== "all") {
      filtered = filtered.filter((order) => order.status === activeButton);
    }
    if (filterClicked) {
      if (selectedOrderCode !== "") {
        filtered = filtered.filter((order) => order.orderCode === selectedOrderCode);
      }
      if (searchOrder !== "") {
        filtered = filtered.filter((order) => {
          const searchOrderLowerCase = searchOrder.toLowerCase();
          return (
            order.orderCode.toLowerCase().includes(searchOrderLowerCase) ||
            order.status.toLowerCase().includes(searchOrderLowerCase) ||
            order.datecreated.includes(searchOrderLowerCase) ||
            order.deadline.includes(searchOrderLowerCase)
          );
        });
      }
      if (selectedDate) {
        const thirtyDaysAgo = subDays(new Date(), 30);
        filtered = filtered.filter((order) => {
          const orderDate = parse(order.datecreated, 'dd/MM/yyyy', new Date());
          return orderDate >= thirtyDaysAgo && orderDate <= new Date();
        });
      }
    }
    setFilteredOrders(filtered);
    setFilterCleared(false);
  }, [activeButton, selectedOrderCode, searchOrder, selectedDate, allOrders, filterClicked]);
  const handleClick = (buttonName: any) => {
    setActiveButton(buttonName);
  };

  const handleOrderCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrderCode(event.target.value);
  };

  const handleSearchOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOrder(event.target.value);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const newThirtyDaysAgo = subDays(date, 30);
    setThirtyDaysAgo(newThirtyDaysAgo);
  };

  const handleFilterClick = () => {
    setFilterClicked(true);
    setFilterCleared(false);
  };

  const handleClearFilter = () => {
    setSelectedOrderCode('');
    setSearchOrder('');
    setSelectedDate(null);
    setFilterCleared(true);
  };

  const handleOrderSelection = (orderCode: string) => {
    if (selectedOrders.includes(orderCode)) {
      // Nếu đơn hàng đã được chọn, hủy bỏ chọn
      setSelectedOrders(selectedOrders.filter((id) => id !== orderCode));
    } else {
      // Nếu đơn hàng chưa được chọn, thêm vào danh sách các đơn hàng được chọn
      setSelectedOrders([...selectedOrders, orderCode]);
    }
  };


  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Nếu checkbox "Chọn tất cả" chưa được chọn, thêm tất cả các orderId vào danh sách selectedOrders
      const selectAllOrder = filteredOrders.map((order) => order.orderCode);
      setSelectedOrders(selectAllOrder);
    } else {
      // Nếu checkbox "Chọn tất cả" đã được chọn, xóa tất cả các orderId khỏi danh sách selectedOrders
      setSelectedOrders([]);
    }
  };


  const handleBatchConfirmation = () => {
    console.log("Đơn hàng được chọn:", selectedOrders);
  };


  return (
    <>
      <div className="container">
        <div className={`${styles["header-order"]}`}>
          <div className={`btn-group ${styles["btn-group"]}`}>
            <button
              type="button"
              className={`btn btn-outline-secondary mt-3 mb-3 ${activeButton === 'all' ? styles.activeButton : ''}`}
              onClick={() => handleClick('all')}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary mt-3 mb-3 ${activeButton === 'Chờ xác nhận' ? styles.activeButton : ''}`}
              onClick={() => handleClick('Chờ xác nhận')}
            >
              Chờ xác nhận
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary mt-3 mb-3 ${activeButton === 'Đang xử lí' ? styles.activeButton : ''}`}
              onClick={() => handleClick('Đang xử lí')}
            >
              Đang xử lí
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary mt-3 mb-3 ${activeButton === 'Đang vận chuyển' ? styles.activeButton : ''}`}
              onClick={() => handleClick('Đang vận chuyển')}
            >
              Đang vận chuyển
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary mt-3 mb-3 ${activeButton === 'Đã giao hàng' ? styles.activeButton : ''}`}
              onClick={() => handleClick('Đã giao hàng')}
            >
              Đã giao hàng
            </button>
            <button
              type="button"
              className={`btn btn-outline-secondary mt-3 mb-3 ${activeButton === 'Đã huỷ' ? styles.activeButton : ''}`}
              onClick={() => handleClick('Đã huỷ')}
            >
              Đã huỷ
            </button>
          </div>
        </div>

        <div className={`${styles["filter-order"]}`}>
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <select
                  className="form-control"
                  id="orderCode"
                  value={selectedOrderCode}
                  onChange={handleOrderCodeChange}
                >
                  <option value="">Code orders</option>
                  {allOrders.map((order) => (
                    <option key={order.orderCode} value={order.orderCode}>
                      {order.orderCode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="searchOrder"
                  value={searchOrder}
                  onChange={handleSearchOrderChange}
                  placeholder="Nhập thông tin đơn hàng"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <DatePicker
                  className="form-control"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Ngày đặt hàng"
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="d-flex col-md-12">
              <h5>Đang lọc:</h5>
              {selectedOrderCode && <span>{selectedOrderCode} | </span>}
              {searchOrder && <span>{searchOrder} | </span>}
              {selectedDate && (
                <span>
                  ngày đặt: {new Date(formattedThirtyDaysAgo).toLocaleDateString("vi-VN")} đến{" "}
                  {selectedDate.toLocaleDateString("vi-VN")}
                </span>
              )}
              <div className="d-flex justify-content-end">
                {filterCleared && <span className="px-3 text-danger">Không có trạng thái lọc</span>}
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-sm mt-2 px-3" onClick={handleClearFilter}>Huỷ lọc</button>
          <button type="button" className="btn btn-primary btn-sm mt-2 px-3 mx-3" onClick={handleFilterClick}>Lọc</button>
        </div>
        <div className={`mt-3 ${styles["order-table"]}`}>
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Code orders</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Total amount</th>
                <th>Confirmation deadline</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.orderCode}
                  className={selectedOrders.includes(order.orderCode) ? styles.selectedRow : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.orderCode)}
                      onChange={() => handleOrderSelection(order.orderCode)}
                    />
                  </td>
                  <td>{order.orderCode}</td>
                  <td>{order.status}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalAmount}</td>
                  <td>{order.deadline}</td>
                  <td><a href="#!">Xem chi tiết</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedOrders.length > 0 && (
          <div className={`${styles["selected-products"]}`}>
            <h5>Đơn hàng được chọn:</h5>
            <ul>
              {selectedOrders.map((orderCode) => (
                <li key={orderCode}>{orderCode}</li>
              ))}
            </ul>
            <button
              className={`btn btn-primary`}
              onClick={handleBatchConfirmation}
            >
              Xác nhận hàng loạt
            </button>
          </div>
        )}
      </div>
    </>
  );

}

export default Orders;
