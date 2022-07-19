const xlsx = require("node-xlsx");
const fs = require("fs");
const list = xlsx.parse("./mobile-nav.xlsx"); // 需要转换的excel文件

const data = list[0]?.data;
const len = data.length;
let result = [];

for (let i = 1; i < len; ) {
  // 防止表格底部出现多余空格，但要注意中间不要有空格哦～～
  if (!data[i]?.length) break;
  const [l1, l2, l3, image_url, target_type, target_data] = data[i];
  // 找到1级菜单
  let item = {
    title: l1,
    children: [],
    target_type: `${target_type}`.toLowerCase(),
    target_data,
  };
  let j = i + 1;
  let item2 = {
    children: [],
  };
  for (; j < len && !data[j]?.[0]; j++) {
    // 找到2级菜单
    if (data[j]?.[1]) {
      const [l1, l2, l3, image_url, target_type, target_data] = data[j];
      // 第一层级
      item2 = {
        title: l2,
        children: [],
        target_type: `${target_type}`.toLowerCase(),
        target_data,
      };
      if (image_url && image_url !== "/") {
        item2.type = "image";
        item2.image_url = image_url;
      }
    }

    // 找到3级菜单
    if (data[j]?.[2]) {
      const [l1, l2, l3, image_url, target_type, target_data] = data[j];
      const item3 = {
        title: l3,
        target_type: `${target_type}`.toLowerCase(),
        target_data,
      };
      if (image_url && image_url !== "/") {
        item3.type = "image";
        item3.image_url = image_url;
      }
      item2.children.push(item3);
    }

    if (j + 1 > len || data[j + 1]?.[0] || data[j + 1]?.[1]) {
      item.children.push(item2);
    } else if (!data[j + 1]?.length) {
      item.children.push(item2);
      break;
    }
  }

  result.push(item);
  i = j;
}

fs.writeFile("top-nav-mobile.json", JSON.stringify(result), "utf-8", () => {
  console.log("=========done=======");
});
