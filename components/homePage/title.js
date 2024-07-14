export const Title = ({ size = "w-[175px] h-[175px] md:w-[250px] md:h-[250px]", textSize = "text-2xl md:text-5xl" }) => {
    return (
        <div className={`flex justify-center items-center bg-white ${size} rounded-full`} >
            <div className={`${textSize} font-quicksand text-[#ff7b73]`}>SnapAid</div>
        </div>
    )
}