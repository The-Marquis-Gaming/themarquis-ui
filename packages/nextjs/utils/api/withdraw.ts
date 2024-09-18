import api from ".";
import { IWithdraw } from "./type";

async function WithDraw(data: IWithdraw): Promise<any> {
  try {
    const response = await api.post("user/withdraw", data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export { WithDraw };
