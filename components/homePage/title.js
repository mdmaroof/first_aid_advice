export const Title = ({ size = "w-[250px] h-[250px]", textSize = "text-5xl" }) => {
    return (
        <div className={`flex justify-center items-center bg-white ${size} rounded-full`} >
            <div className={`${textSize} font-quicksand text-[#ff7b73]`}>SnapAid</div>
        </div>
    )
}