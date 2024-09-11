import api from ".";
import { withdraw } from "./type";

async function WithDraw(data: withdraw): Promise<any> {
  try {
    const response = await api.post("user/withdraw", data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export { WithDraw };
