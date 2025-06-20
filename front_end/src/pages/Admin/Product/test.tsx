import { Toaster, toast } from "sonner";

function Test() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <button onClick={() => toast.success("Thành công rồi bro 😎")}>
        Gọi thông báo
      </button>
    </>
  );
}
export default Test  ; 
