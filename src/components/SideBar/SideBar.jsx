// import { Box, Button, Drawer, MenuItem, Typography } from "@mui/material";
// import * as React from "react";
// import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
// import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
// import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
// import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/Logo.png"; 

// const drawerWidth = 240;

// const SideBar = () => {
//   const navigate = useNavigate();

//   return (
//     <Drawer
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: drawerWidth,
//           boxSizing: "border-box",
//           color: "white",
//         },
//         "& .MuiPaper-root": {
//           background: "#171B36",
//         },
//       }}
//       variant="permanent"
//       anchor="left"
//     >
//       {/* Phần logo ở phía trên */}
//       <Box display="flex" justifyContent="center" alignItems="center" sx={{ padding: "20px" }}>
//         <img src={logo} alt="Logo" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
//       </Box>

//       <Divider />

//       {/* Phần danh sách các nút */}
//       <Box display="flex" flexDirection="column" justifyContent="flex-end" sx={{ height: "100%" }}>
//         <Box display={"flex"} justifyContent={"center"} alignContent={"center"}>
//           <ListItemButton sx={{ alignItems: "center" }}> {/* Căn giữa nội dung */}
//             <ListItemIcon sx={{ minWidth: "40px" }}> {/* Đảm bảo kích thước icon không làm lệch nội dung */}
//                 <AddCircleOutlineOutlinedIcon/>
//             </ListItemIcon>
//             <ListItemText>
//               Tạo đơn
//             </ListItemText>
//           </ListItemButton>
//         </Box>

//         <Divider />

//         <List
//           sx={{ width: "100%", maxWidth: 360, bgcolor: "inherit", flexGrow: 1 }}
//           component="nav"
//         >
//           {["Thống kê", "Đơn hàng", "Trang cá nhân"].map((text, index) => (
//             <ListItem
//               key={text}
//               onClick={
//                 index === 0
//                   ? () => {
//                       navigate("/form");
//                     }
//                   : index === 1
//                   ? () => {
//                       navigate("/");
//                     }
//                   : index === 2
//                   ? () => {
//                       navigate("/login");
//                     }
//                   : undefined
//               }
//               sx={{ display: "flex" }}
//             >
//               <ListItemButton sx={{ alignItems: "center" }}> {/* Căn giữa nội dung */}
//                 <ListItemIcon
//                   sx={{
//                     color: "white",
//                     minWidth: "40px",  // Đảm bảo icon có kích thước đồng nhất
//                   }}
//                 >
//                   {index === 0 ? (
//                     <InsertChartOutlinedIcon />
//                   ) : index === 1 ? (
//                     <LocalShippingOutlinedIcon />
//                   ) : index === 2 ? (
//                     <PermIdentityOutlinedIcon />
//                   ) : undefined}
//                 </ListItemIcon>
//                 <ListItemText primary={text} />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>

//         <Divider />
//       </Box>
//     </Drawer>
//   );
// };

// export default SideBar;
