import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "./Store"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected,
) => useSelector(selector)
