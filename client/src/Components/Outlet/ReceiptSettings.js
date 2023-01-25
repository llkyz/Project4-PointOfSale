import { DebounceInput } from "react-debounce-input";
import receipt from "../../Assets/receipt.png";

export default function ReceiptSettings({
  setView,
  settingData,
  setSettingData,
  setUpdateSettingTrigger,
}) {
  return (
    <div style={{ width: "70%", margin: "0 auto" }}>
      <div className="pageHeader">
        <img src={receipt} className="pageImage" alt="overview" />
        <div className="pageTitle">Receipt Settings</div>
      </div>
      <div
        className="function"
        style={{ display: "block" }}
        onClick={() => {
          setView(false);
        }}
      >
        ← Back
      </div>
      <div
        style={{
          display: "inline-block",
          marginRight: "50px",
          verticalAlign: "top",
          textAlign: "left",
          width: "45%",
          minWidth: "300px",
        }}
      >
        <div className="header" style={{ marginTop: "20px" }}>
          E D I T
        </div>
        <div className="separator" style={{ marginBottom: "20px" }} />
        <div>Name</div>
        <DebounceInput
          className="entryInput"
          type="text"
          value={settingData.name}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({ ...settingData, name: event.target.value });
            setUpdateSettingTrigger(true);
          }}
        />
        <div style={{ marginTop: "20px" }}>Address Line 1</div>
        <DebounceInput
          type="text"
          className="entryInput"
          value={settingData.address1}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({
              ...settingData,
              address1: event.target.value,
            });
            setUpdateSettingTrigger(true);
          }}
        />
        <div>Address Line 2</div>
        <DebounceInput
          type="text"
          className="entryInput"
          value={settingData.address2}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({
              ...settingData,
              address2: event.target.value,
            });
            setUpdateSettingTrigger(true);
          }}
        />
        <div style={{ marginTop: "20px" }}>Tax Registration Number</div>
        <DebounceInput
          type="text"
          className="entryInput"
          value={settingData.taxNum}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({ ...settingData, taxNum: event.target.value });
            setUpdateSettingTrigger(true);
          }}
        />
        <div style={{ marginTop: "20px" }}>Telephone Number</div>
        <DebounceInput
          type="text"
          className="entryInput"
          value={settingData.telephone}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({
              ...settingData,
              telephone: event.target.value,
            });
            setUpdateSettingTrigger(true);
          }}
        />
        <div style={{ marginTop: "20px" }}>Fax Number</div>
        <DebounceInput
          type="text"
          className="entryInput"
          value={settingData.fax}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({ ...settingData, fax: event.target.value });
            setUpdateSettingTrigger(true);
          }}
        />
        <div style={{ marginTop: "20px" }}>Footer</div>
        <DebounceInput
          element="textarea"
          className="entryInput"
          style={{ fontFamily: "arial", height: "50px", resize: "none" }}
          value={settingData.footer}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({ ...settingData, footer: event.target.value });
            setUpdateSettingTrigger(true);
          }}
        />
      </div>
      <div
        style={{ display: "inline-block", verticalAlign: "top", width: "45%" }}
      >
        <div className="header" style={{ marginTop: "20px" }}>
          P R E V I E W
        </div>
        <div className="separator" />
        <div
          style={{
            border: "1px solid black",
            width: "fit-content",
            margin: "0 auto",
            padding: "0 20px",
            marginBottom: "50px",
            marginTop: "20px",
          }}
        >
          {settingData.name ? <p>{settingData.name}</p> : ""}
          {settingData.address1 ? <p>{settingData.address1}</p> : ""}
          {settingData.address1 ? <p>{settingData.address2}</p> : ""}
          <p>
            TEL: {settingData.telephone} FAX: {settingData.fax}
          </p>
          {settingData.taxNum ? <p>GST No: {settingData.taxNum}</p> : ""}
          {settingData.footer ? <p>{settingData.footer}</p> : ""}
          <div style={{ textAlign: "left" }}>
            <p>===============================================</p>
            <div>
              <span style={{ float: "left" }}>Table: 5</span>
              <span style={{ float: "right" }}>20 MAR 2023 6:45PM</span>
            </div>
            <p>===============================================</p>
            <div>
              Qty Item
              <span style={{ float: "right" }}>Total</span>
            </div>
            <div>
              1 Coffee
              <span style={{ float: "right" }}>1.40</span>
            </div>
            <div>
              2 Ramen
              <span style={{ float: "right" }}>13.00</span>
            </div>
            <div>
              1 Ice Cream
              <span style={{ float: "right" }}>5.45</span>
            </div>
            <p></p>
            <div>
              Subtotal
              <span style={{ float: "right" }}>19.85</span>
            </div>
            <div>
              Tax (8%)
              <span style={{ float: "right" }}>1.58</span>
            </div>
            <div>
              Service Charge (10%)
              <span style={{ float: "right" }}>1.98</span>
            </div>
            <div>
              Total
              <span style={{ float: "right" }}>23.41</span>
            </div>
            <p>===============================================</p>
          </div>
          <p>THANK YOU, PLEASE COME AGAIN!</p>
        </div>
      </div>
    </div>
  );
}
