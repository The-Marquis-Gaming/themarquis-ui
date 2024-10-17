import api from ".";
import { notification } from "../scaffold-stark";
import { IWithdraw } from "./type";

async function WithDraw(data: IWithdraw): Promise<any> {
  try {
    const response = await api.post("user/withdraw", data);
    return response.data;
  } catch (err: any) {
    notification.error(err.response.data.message);
  }
}

export { WithDraw };
