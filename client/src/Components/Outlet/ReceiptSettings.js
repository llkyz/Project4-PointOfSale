import { DebounceInput } from "react-debounce-input";

export default function ReceiptSettings({
  setView,
  settingData,
  setSettingData,
  setUpdateSettingTrigger,
}) {
  return (
    <>
      <h1>Receipt Settings</h1>
      <button onClick={() => setView(false)}>Back</button>
      <div>
        <label>Name</label>
        <DebounceInput
          type="text"
          value={settingData.name}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({ ...settingData, name: event.target.value });
            setUpdateSettingTrigger(true);
          }}
        />
      </div>
      <div>
        <label>Address Line 1</label>
        <DebounceInput
          type="text"
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
      </div>
      <div>
        <label>Address Line 2</label>
        <DebounceInput
          type="text"
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
      </div>
      <div>
        <label>Tax Registration Number</label>
        <DebounceInput
          type="text"
          value={settingData.taxNum}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({ ...settingData, taxNum: event.target.value });
            setUpdateSettingTrigger(true);
          }}
        />
      </div>
      <div>
        <label>Telephone Number</label>
        <DebounceInput
          type="text"
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
      </div>
      <div>
        <label>Fax Number</label>
        <DebounceInput
          type="text"
          value={settingData.fax}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({ ...settingData, fax: event.target.value });
            setUpdateSettingTrigger(true);
          }}
        />
      </div>
      <div>
        <label>Footer</label>
        <DebounceInput
          type="text"
          value={settingData.footer}
          debounceTimeout={1000}
          onChange={(event) => {
            setSettingData({ ...settingData, footer: event.target.value });
            setUpdateSettingTrigger(true);
          }}
        />
      </div>
      <h1>Receipt Preview</h1>
      <div
        style={{
          border: "1px solid black",
          width: "fit-content",
          margin: "0 auto",
          padding: "0 20px",
          marginBottom: "50px",
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
    </>
  );
}
