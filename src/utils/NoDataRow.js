import React from "react";

const NoDataRow = ({ colSpan = 9, height = "400px", message = "데이터가 없습니다." }) => {
  return (
    <tr style={{ height }}>
      <td
        colSpan={colSpan}
        style={{ textAlign: "center", padding: "16px", color: "#9c9c9cff", fontSize: "16px" }}
      >
        {message}
      </td>
    </tr>
  );
};

export default NoDataRow;
