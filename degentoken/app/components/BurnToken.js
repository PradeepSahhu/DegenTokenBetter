export default function BurnToken({ setBurnAmount, burnMyToken }) {
  return (
    <div className=" bg-black text-white grid grid-cols-2 m-10">
      <form className="grid bg-[#005C78] px-20 py-10  col-start-1 col-end-3 mx-64 rounded-xl">
        <div className="flex justify-center mb-5">
          <p className="text-2xl font-bold text-white text-transparent">
            Burn Tokens
          </p>
        </div>
        <label className="grid col-start-1 col-end-1 ">Enter the Amount</label>
        <input
          className="text-white bg-slate-800 p-5 rounded-md mx-5 my-5"
          onChange={(e) => setBurnAmount(e.target.value)}
          name="TokenAmount"
        />
      </form>

      <div className="flex justify-center col-span-2 items-center py-5">
        <button
          className="bg-blue-900 p-5 rounded-xl hover:bg-rose-900"
          onClick={() => burnMyToken()}
        >
          Start Burning...
        </button>
      </div>
    </div>
  );
}
