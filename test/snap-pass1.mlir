module {
  func.func @test(%arg0: i32) -> i32 {
    %c2_i32 = arith.constant 2 : i32
    %0 = arith.muli %c2_i32, %arg0 : i32
    %1 = arith.muli %0, %c2_i32 : i32
    return %1 : i32
  }
}
