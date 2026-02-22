import { styled, SxProps } from "@mui/material";
import { CalculatorProps } from "./CalculatorCommon";
import { AddButton, BracketButton, Button0, Button1, Button2, Button3, Button4, Button5, Button6, Button7, Button8, Button9, ClearButton, DivButton, EqualButton, EraseButton, FavoriteButton, FunButton, HistoryButton, LeftButton, MemoryButton, MulButton, PercentButton, PointButton, RightButton, SubButton, VarButton } from "./CalculatorButtons";

const RootGrid = styled("div")({
    display: "grid",
    gridTemplateRows: "2fr 1fr 3fr",
    gridTemplateColumns: "1fr",
    width: "100%",
    height: "100%",
});

const PartialGrid = styled("div")({
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "1fr 5fr 1fr 1fr",
});

const KeyGrid = styled("div")({
    display: "grid",
    gridTemplateRows: "1fr 1fr 1fr",
    gridTemplateColumns: "repeat(8,1fr)",
});

const keyGridSx: SxProps = {
    backgroundColor: "normalButton",
}

export default function CalculatorLandscape(props: CalculatorProps) {
    return (
        <RootGrid>
            {props.editor}
            <PartialGrid>
                <EqualButton {...props} />
                {props.result}
                <EraseButton {...props} />
                <ClearButton {...props} />
            </PartialGrid>
            <KeyGrid sx={keyGridSx}>
                {/* First Line */}

                <LeftButton {...props} />
                <RightButton {...props} />
                <Button7 {...props} />
                <Button8 {...props} />
                <Button9 {...props} />
                <DivButton {...props} />
                <MulButton {...props} />
                <MemoryButton {...props} />

                {/* Second Line */}

                <VarButton {...props} />
                <FunButton {...props} />
                <Button4 {...props} />
                <Button5 {...props} />
                <Button6 {...props} />
                <SubButton {...props} />
                <AddButton {...props} />
                <HistoryButton {...props} />

                {/* Third Line */}

                <FavoriteButton {...props} />
                <PercentButton {...props} />
                <Button1 {...props} />
                <Button2 {...props} />
                <Button3 {...props} />
                <Button0 {...props} />
                <PointButton {...props} />
                <BracketButton {...props} />
            </KeyGrid>
        </RootGrid>
    );
}
