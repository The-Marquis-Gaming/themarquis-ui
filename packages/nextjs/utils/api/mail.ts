import api from ".";
import { subscribeEmail } from "./type";
async function subscribe(data: subscribeEmail): Promise<any> {
  return await api.post("mail/mailing-list-member", data);
}

export { subscribe };
