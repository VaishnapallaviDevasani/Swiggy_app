package com.zomato.controller;

import com.zomato.model.CartItem;
import com.zomato.model.Food;
import com.zomato.model.User;
import com.zomato.repository.CartItemRepository;
import com.zomato.repository.FoodRepository;
import com.zomato.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodRepository foodRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        return userRepository.findByUsername(auth.getName()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getCartItems() {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<CartItem> items = cartItemRepository.findByUser(user);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest request) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Food food = foodRepository.findById(request.getFoodId()).orElse(null);
        if (food == null) return ResponseEntity.badRequest().body("Food not found");

        CartItem item = new CartItem();
        item.setUser(user);
        item.setFood(food);
        item.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        
        return ResponseEntity.ok(cartItemRepository.save(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        CartItem item = cartItemRepository.findById(id).orElse(null);
        if (item == null || !item.getUser().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Item not found or unauthorized");
        }

        cartItemRepository.delete(item);
        return ResponseEntity.ok().build();
    }
}

class CartItemRequest {
    private Long foodId;
    private Integer quantity;

    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
