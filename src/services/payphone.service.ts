import axios from "axios";
import { CustomError } from "../errors/customError.error";

const PAYPHONE_CONFIRM_URL = "https://paymentbox.payphonetodoesposible.com/api/confirm";

export function payphoneConfig() {
  const token = process.env.PAYPHONE_TOKEN?.trim();
  const storeId = process.env.PAYPHONE_STORE_ID?.trim();
  if (!token || !storeId) throw new CustomError("Los pagos con Payphone aún no están habilitados", 503);
  return { token, storeId };
}

export async function confirmPayphoneTransaction(id: string | number, clientTransactionId: string) {
  const { token } = payphoneConfig();
  try {
    const response = await axios.post<Record<string, unknown>>(
      PAYPHONE_CONFIRM_URL,
      { id: Number(id), clientTxId: clientTransactionId },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 },
    );
    return response.data;
  } catch {
    throw new CustomError("No se pudo confirmar el pago con Payphone", 502);
  }
}
